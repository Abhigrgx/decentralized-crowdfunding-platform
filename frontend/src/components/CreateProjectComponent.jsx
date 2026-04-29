import { useForm } from "react-hook-form";
import { useState } from "react";
import { uploadImage } from "../api/client";

const CATEGORIES = ["Design & Tech", "Film", "Arts", "Games"];

export default function CreateProjectComponent({ contract }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);

  async function onSubmit(data) {
    setLoading(true);
    try {
      let projectCid = "";
      const imageFile = data.projectImage?.[0];

      if (imageFile) {
        const uploadResult = await uploadImage(imageFile);
        projectCid = uploadResult?.cid || "";
      }

      const fundingGoal = Number(data.fundingGoal);
      const durationInMinutes = Number(data.duration) * 24 * 60;
      const txn = await contract.createNewProject(
        data.projectName,
        data.projectDescription,
        data.creatorName,
        data.projectLink || "",
        projectCid,
        fundingGoal,
        durationInMinutes,
        Number(data.category),
        Number(data.refundPolicy)
      );
      await txn.wait();
      alert("Project created successfully!");
      reset();
    } catch (err) {
      console.error("Create project error:", err);
      alert("Error creating project: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="create-form">
      <h1>Start a Project</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Creator Name</label>
        <input {...register("creatorName", { required: "Required" })} placeholder="Your name" />
        <div className="error">{errors.creatorName?.message}</div>

        <label>Project Name</label>
        <input {...register("projectName", { required: "Required" })} placeholder="Project title" />
        <div className="error">{errors.projectName?.message}</div>

        <label>Project Description</label>
        <textarea {...register("projectDescription", { required: "Required" })} placeholder="Describe your project" />
        <div className="error">{errors.projectDescription?.message}</div>

        <label>Project Link</label>
        <input {...register("projectLink")} placeholder="https://..." />

        <label>Upload Project Image</label>
        <input
          type="file"
          accept="image/*"
          {...register("projectImage")}
        />
        <div className="caution">*Image of resolution 1920x1080 is preferred for better display</div>

        <label>Funding Goal (AVAX)</label>
        <input type="number" step="1" min="1"
          {...register("fundingGoal", {
            required: "Required",
            min: 1,
            validate: (value) => Number.isInteger(Number(value)) || "Use a whole AVAX amount",
          })} placeholder="e.g. 10" />
        <div className="error">{errors.fundingGoal?.message}</div>

        <label>Duration (days)</label>
        <input type="number" min="1"
          {...register("duration", { required: "Required", min: 1 })} placeholder="e.g. 30" />
        <div className="error">{errors.duration?.message}</div>

        <label>Category</label>
        <select {...register("category", { required: "Required" })}>
          {CATEGORIES.map((cat, idx) => <option key={idx} value={idx}>{cat}</option>)}
        </select>

        <label>Refund Policy</label>
        <select {...register("refundPolicy")}>
          <option value={0}>Refundable</option>
          <option value={1}>Non-Refundable</option>
        </select>
        <div className="caution">Non-refundable projects keep funds even if goal is not met.</div>

        <button className="submitButton" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Project"}
        </button>
      </form>
    </div>
  );
}
