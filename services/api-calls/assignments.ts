import { UnauthorizedException } from "@/utils/exception";
import { getTokenLocal } from "../storages/token";
import instance from "./axios";
import { getClassInfo } from "./classes";

export type Assignment = {
  id: number;
  title: string;
  description: string;
  lecturer_id: string;
  deadline: string;
  file_url?: string;
  is_submitted: boolean;
  class_id: string;
  class_name: string;
};

type Meta = {
  code: string;
  message: string;
};

type AssignmentResponse = {
  data: Assignment[];
  meta: Meta;
};

type ErrorResponse = {
  data: string;
  meta: Meta;
};

export async function fetchAssignments(typeOfAssignments: string, classId?: string) {
  try {
    const requestBody: any = { type: typeOfAssignments };
    if (classId) {
      requestBody.class_id = classId;
    }

    // Gửi request đến API
    const response: AssignmentResponse = await instance.post("/it5023e/get_student_assignments", requestBody);
    const assignments = response.data;

    const assignmentsWithClassNames = await Promise.all(
      assignments.map(async (assignment) => {
        try {
          const classInfoResponse = await getClassInfo({ class_id: assignment.class_id });
          return {
            ...assignment,
            class_name: classInfoResponse.data.class_name, // Gắn `class_name` vào assignment
          };
        } catch (error) {
          console.error(`Error fetching class info for class_id: ${assignment.class_id}`, error);
          return {
            ...assignment,
            class_name: "Lớp học không xác định", // Xử lý mặc định nếu lỗi
          };
        }
      })
    );

    return assignmentsWithClassNames;
  } catch (error: any) {
    // Xử lý lỗi
    console.error("Error fetching assignments:", error.message);
    throw error;
  }
}

type Submission = {
  id: string;
  assignment_id: string;
  submission_time: string;
  grade?: string;
  file_url?: string;
  text_response?: string;
  student_account: any;
};

type SubmissionResponse = {
  data: Submission;
  meta: Meta;
};
export async function fetchSubmission(assignment_id: string) {
  try {
    const response: SubmissionResponse = await instance.post("/it5023e/get_submission", {
      assignment_id,
    });
    const submission = response.data;

    return submission;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.rawError;
    const { data, meta } = errorResponse;
    const { code, message } = meta;

    if (code === "9994") {
      console.log(errorResponse);
      error.setIsVisible(false)
    }
    throw error;
  }
}

type SubmitSurveyResponse = {
  data: {
    submission_id: string;
  };
  meta: Meta;
};

export async function submitSurvey(formData: FormData) {
  try {
    const token = await getTokenLocal();
    if (!token) throw new UnauthorizedException();

    formData.append("token", token as string);
    const response: SubmitSurveyResponse = await instance.post("/it5023e/submit_survey", formData, {
      headers: {
        "no-need-token": true,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (err: any) {
    const errorResponse: ErrorResponse = err.rawError;
    const { data, meta } = errorResponse;
    const { code, message } = meta;
    if (code === "9999") {
      err.setTitle("Đã quá hạn nộp bài");
      err.setContent("Bạn không thể nộp bài nữa")
    }
    console.error(errorResponse);
    throw err;
  }
}
