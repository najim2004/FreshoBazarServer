import { GraphQLError } from "graphql";
import { getAuthorizationHeader } from "../utils/getAuthorizationHeader.js";
import { verifyToken } from "../utils/verifyToken.js";
import { User } from "../models/user.model.js";

export const authMiddleware = {
  async authenticate(resolver, parent, args, context, info) {
    const token = getAuthorizationHeader(context.req);
    const { data } = verifyToken(token);
    const user = await User.findById({ _id: data?._id })
      .select("-password")
      .lean();
    if (!user) {
      throw new GraphQLError("User not found", {
        extensions: { code: "UNAUTHENTICATED" },
      });
    }
    context.user = user;

    return resolver(parent, args, context, info);
  },

  protect(next) {
    return async (parent, args, context, info) => {
      await authMiddleware.authenticate(next, parent, args, context, info);
      return next(parent, args, context, info);
    };
  },

  restrictTo(...roles) {
    return (next) => async (parent, args, context, info) => {
      await authMiddleware.authenticate(next, parent, args, context, info);

      if (!roles.includes(context.user.role)) {
        throw new GraphQLError(
          "You do not have permission to perform this action",
          {
            extensions: { code: "FORBIDDEN" },
          }
        );
      }

      return next(parent, args, context, info);
    };
  },
  optionalAuth(next) {
    return async (parent, args, context, info) => {
      try {
        const token = getAuthorizationHeader(context.req);
        if (token) {
          const { data } = verifyToken(token);
          const user = await User.findById({ _id: data?._id })
            .select("_id email role number isDelete")
            .lean();
          if (user) {
            context.user = user;
          }
        }
      } catch (error) {
        // Ignore auth errors and continue
      }

      return next(parent, args, context, info);
    };
  },
};
