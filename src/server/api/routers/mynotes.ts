/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const notesRouter = createTRPCRouter({
  newNote: publicProcedure
    .input(
      z.object({
        title: z
          .string()
          .min(5, { message: " Must be 5 or more characters of length" })
          .max(200, { message: " Must be max 200 characters" })
          .trim(),
        description: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.notes.create({
          data: {
            title: input.title,
            description: input.description,
          },
        });
      } catch (err) {
        console.log("Notes cannot be created: ", err);
        throw new Error("Failed to create note");
      }
    }),
  allNotes: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.notes.findMany({
        select: {
          title: true,
          id: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (err) {
      console.log("Notes cannot be found: ", err);
    }
  }),
});
