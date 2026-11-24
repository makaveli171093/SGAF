import { api } from "../lib/axios";
import { studentPage, teacherPage } from "../lib/legacyPagination";
import type {
  MyAssignmentsResponse, TaskQuery,
  TeacherAssignmentsResponse,
} from "../types/assignments";

interface CreateAssignmentInput {
  groupId: string;
  title: string;
  instructions: string;
  dueDate: string;
}

interface CreateAssignmentResponse {
  message: string;
  assignment: {
    id: string;
    tittle: string;
    dueDate: string;
  };
}

export const assignmentsService = {
  async getMine(
    accessToken: string,
    signal: AbortSignal,
    params: TaskQuery = {},
  ): Promise<MyAssignmentsResponse> {
    const response = await api.get<MyAssignmentsResponse>(
      "/assignments/my-assignments",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        signal, params,
      },
    );

    return studentPage(response.data, params);
  },
  async create(
    accessToken: string,
    values: CreateAssignmentInput,
  ): Promise<CreateAssignmentResponse> {
    const response = await api.post<CreateAssignmentResponse>(
      "/assignments",
      values,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return response.data;
  },
  async getTeacherAssignments(
    accessToken: string,
    signal: AbortSignal,
    params: TaskQuery = {},
  ): Promise<TeacherAssignmentsResponse> {
    const response = await api.get<TeacherAssignmentsResponse>(
      "/assignments/teacher",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        signal, params,
      },
    );

    return teacherPage(response.data, params);
  },
};
