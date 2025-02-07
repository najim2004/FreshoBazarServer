import { GraphQLError } from "graphql";
import { getAuthorizationHeader } from "../utils/getAuthorizationHeader.js";
import { verifyToken } from "../utils/verifyToken.js";
import { User } from "../models/user.model.js";

const authenticate = async (context) => {
  const token = getAuthorizationHeader(context.req);
  if (!token) {
    throw new GraphQLError("Not authenticated", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }

  const { data } = verifyToken(token);
  const user = await User.findById(data?._id).select("-password").lean();

  if (!user) {
    throw new GraphQLError("User not found", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }

  return user;
};

export const authMiddleware = {
  protect(next) {
    return async (parent, args, context, info) => {
      context.user = await authenticate(context);
      return next(parent, args, context, info);
    };
  },

  restrictTo(...roles) {
    return (next) => async (parent, args, context, info) => {
      context.user = await authenticate(context);

      if (!roles.includes(context.user.role)) {
        throw new GraphQLError("Permission denied", {
          extensions: { code: "FORBIDDEN" },
        });
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
          const user = await User.findById(data?._id)
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
