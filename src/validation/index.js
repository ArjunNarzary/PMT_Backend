const z = require("zod");

const RegisterSchema = z.object({
    name: z.string({ message: "Name is required" }),
    email: z.string({ message: "Email is required" }).email({ message: "Invalid email address" }),
    password: z.string({ message: "Password is required" }).min(8, { message: "Password must be at least 8 characters" }),
});

const LoginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Invalid Password" }),
});

const CreateProjectSchema = z.object({
    title: z.string({ message: "Title is required" }),
    description: z.string({ message: "Description is required" }),
});

const CreateTaskSchema = z.object({
    title: z.string({ message: "Title is required" }),
    description: z.string().optional(),
    priority: z.enum(["low", "medium", "high"]).optional(),
    dueDate: z.string().optional(),
    estimate: z.number().optional(),
});

const UpdateTaskSchema = z.object({
    title: z.string({ message: "Title is required" }).optional(),
    description: z.string().optional(),
    priority: z.enum(["low", "medium", "high"]).optional(),
    dueDate: z.string().optional(),
    estimate: z.number().optional(),
    status: z.enum(["TO DO", "IN PROGRESS", "BLOCKED", "DONE"]).optional(),
    timer: z.object({
        start: z.date().optional(),
        end: z.date().optional()
    }).optional(),
    assignee: z.string().optional(),
});

const CreateWorklogSchema = z.object({
    description: z.string({ message: "Description is required" }),
    taskId: z.string({ message: "Task is required" }),
    timeSpent: z.number({ message: "Time Spent is required" }),
})

const UpdateWorklogSchema = z.object({
    description: z.string({ message: "Description is required" }).optional(),
    timeSpent: z.number({ message: "Time Spent is required" }).optional(),
})


module.exports = { RegisterSchema, LoginSchema, CreateProjectSchema, CreateTaskSchema, UpdateTaskSchema, CreateWorklogSchema, UpdateWorklogSchema };