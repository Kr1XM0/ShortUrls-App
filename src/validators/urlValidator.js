import z from "zod";

const urlSchema = z.object({
  original_url: z.url().min(1, "URL is required").max(2048, "URL is too long"),
  alias: z
    .string()
    .min(3, "Alias must be at least 3 characters")
    .max(50, "Alias must be less than 50 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Alias can only contain letters, numbers, underscores, and hyphens"
    )
    .optional()
    .or(z.literal("")),
});

const validateUrls = (input) => {
  return urlSchema.safeParse(input);
};

export default validateUrls;
