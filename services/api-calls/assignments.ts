import { UnauthorizedException } from "@/utils/exception";
import { getTokenLocal } from "../storages/token";
import instance from "./axios";
import { getClassInfo } from "./classes";

export type Assignment = {
  id: number;
  title: string;
  description?: string;
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
          console.log(`Error fetching class info for class_id: ${assignment.class_id}`, error);
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
    console.log("Error fetching assignments:", error.message);
    throw error;
  }
}

export type Submission = {
  id: string;
  assignment_id: string;
  submission_time: string;
  grade?: string;
  file_url?: string;
  text_response?: string;
  student_account: StudentAccount;
};

export type StudentAccount = {
  account_id: string;
  last_name: string;
  first_name: string;
  email: string;
  student_id: string;
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
    if (error?.rawError) {
      const errorResponse: ErrorResponse = error.rawError;
      const { data, meta } = errorResponse;
      const { code, message } = meta;

      if (code === "9994") {
        error.setIsVisible(false);
      }
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
    if (err?.rawError) {
      const errorResponse: ErrorResponse = err.rawError;
      const { data, meta } = errorResponse;
      const { code, message } = meta;
      if (code === "9999") {
        err.setTitle("Đã quá hạn nộp bài");
        err.setContent("Bạn không thể nộp bài nữa");
      }
    }
    throw err;
  }
}
//
//
//
//
//
//api-lecturer
export type Survey = {
  id: number;
  title: string;
  description?: string;
  lecturer_id: string;
  deadline: string;
  file_url?: string;
  class_id: string;
  class_name?: string;
};

type SurveyResponse = {
  data: Survey[];
  meta: Meta;
};

export async function fetchSurveys(classId: string) {
  try {
    const requestBody: any = { class_id: classId };

    // Gửi request đến API
    const response: SurveyResponse = await instance.post("/it5023e/get_all_surveys", requestBody);
    var surveys = response.data.reverse();

    try {
      const classInfoResponse = await getClassInfo({ class_id: classId });
      const className = classInfoResponse.data.class_name;
      surveys = surveys.map((survey) => {
        return {
          ...survey,
          class_name: className, // Gắn `class_name` vào survey
        };
      });
    } catch {
      surveys = surveys.map((survey) => {
        return {
          ...survey,
          class_name: "",
        };
      });
    }

    return surveys;
  } catch (error: any) {
    // Xử lý lỗi
    console.log("Error fetching surveys:", error.message);
    throw error;
  }
}

type SurveyResponsesResponse = {
  data: Submission[];
  meta: Meta;
};

export async function fetchSurveyResponses(surveyId: string, submissionId?: string, score?: string) {
  try {
    const requestBody: any = { survey_id: surveyId };
    if (submissionId && score) {
      requestBody.grade = {
        score,
        submission_id: submissionId,
      };
    }

    // Gửi request đến API
    const response: SurveyResponsesResponse = await instance.post("/it5023e/get_survey_response", requestBody);
    const surveyresponses = response.data;

    return surveyresponses;
  } catch (err: any) {
    if (err?.rawError) {
      const errorResponse: ErrorResponse = err.rawError;
      const { data, meta } = errorResponse;
      const { code, message } = meta;

      if (code === "9999") {
        err.setTitle("Không tìm thấy bài tập");
        err.setContent("Bài tập này hiện không tồn tại hoặc đã bị xóa.");
      }
    }
    throw err;
  }
}

type CreateSurveyResponse = {
  data: string;
  meta: Meta;
};
export async function createSurvey(formData: FormData) {
  try {
    const token = await getTokenLocal();
    if (!token) throw new UnauthorizedException();

    formData.append("token", token as string);
    const response: CreateSurveyResponse = await instance.post("/it5023e/create_survey", formData, {
      headers: {
        "no-need-token": true,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (err: any) {
    if (err?.rawError) {
      const errorResponse: ErrorResponse = err.rawError;
      const { data, meta } = errorResponse;
      const { code, message } = meta;

      if (code === "1004") {
        err.setTitle("Deadline không hợp lệ");
        err.setContent("Thời gian kết thúc không được trước thời gian hiện tại.");
      }
    }
    throw err;
  }
}

type EditSurveyResponse = {
  data: Survey;
  meta: Meta;
};
export async function editSurvey(formData: FormData) {
  try {
    const token = await getTokenLocal();
    if (!token) throw new UnauthorizedException();

    formData.append("token", token as string);
    const response: EditSurveyResponse = await instance.post("/it5023e/edit_survey", formData, {
      headers: {
        "no-need-token": true,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (err: any) {
    if (err?.rawError) {
      const errorResponse: ErrorResponse = err.rawError;
      const { data, meta } = errorResponse;
      const { code, message } = meta;
      if (code === "1004") {
        err.setTitle("Deadline không hợp lệ");
        err.setContent("Thời gian kết thúc không được trước thời gian hiện tại.");
      }

      if (code === "9999") {
        err.setTitle("Không thể sửa bài tập");
        err.setContent("Bài tập này hiện không tồn tại hoặc đã bị xóa.");
      }
    }
    throw err;
  }
}

type DeleteSurveyResponse = {
  data: string;
  meta: Meta;
};
export async function deleteSurvey(surveyId: string) {
  try {
    const response: DeleteSurveyResponse = await instance.post("/it5023e/delete_survey", {
      survey_id: surveyId,
    });
    const status = response.data;

    return status;
  } catch (err: any) {
    if (err?.rawError) {
      const errorResponse: ErrorResponse = err.rawError;
      const { data, meta } = errorResponse;
      const { code, message } = meta;

      if (code === "1004") {
        err.setTitle("Không thể xóa bài tập");
        err.setContent("Không thể xóa bài tập khi có người Đã nộp bài.");
      }
      if (code === "9999") {
        err.setTitle("Không thể xóa bài tập");
        err.setContent("Bài tập này hiện không tồn tại hoặc đã bị xóa.");
      }
    }
    throw err;
  }
}
