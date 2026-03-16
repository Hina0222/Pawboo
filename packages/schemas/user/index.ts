import {z} from "zod";

export const MeResponseSchema = z.object({
  id: z.number(),
  nickname: z.string(),
  profileImage: z.string().nullable(),
  followerCount: z.number(),
  followingCount: z.number(),
});

export const ProfileUpdateSchema = z.object({
  nickname: z.string().min(1).max(20).optional(),
});

export type MeResponse = z.infer<typeof MeResponseSchema>;
export type ProfileUpdateRequest = z.infer<typeof ProfileUpdateSchema>;
