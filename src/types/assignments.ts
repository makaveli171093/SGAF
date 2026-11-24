export interface StudentSubmission {
  id: string;
  textContent: string | null;
  fileUrl: string | null;
  grade: string | number | null;
  feedback: string | null;
  gradedAt: string | null;
  submittedAt: string;
}

export interface StudentAssignment {
  id: string;
  tittle: string;
  instructions: string;
  dueDate: string;

  group: {
    id: string;
    name: string;

    subject: {
      code: string;
      name: string;
    };

    teacher: {
      user: {
        firstName: string;
        lastName: string;
      };
    };
  };

  submissions: StudentSubmission[];
}

export interface TaskQuery { page?: number; pageSize?: number; q?: string; group?: string; period?: string; status?: string; order?: string; }
export interface PageInfo { pagination?: { total: number; page: number; pageSize: number }; filters?: { groups: {id:string;label:string}[]; periods?: string[] }; pending?: number; }
export interface MyAssignmentsResponse extends PageInfo {
  message: string;
  assignments: StudentAssignment[];
}

export interface TeacherAssignment {
  id: string;
  tittle: string;
  instructions: string;
  dueDate: string;

  group: {
    id: string;
    name: string;
    subject: {
      name: string;
      code: string;
    };
    academicPeriod: {
      name: string;
    };
  };

  _count: {
    submissions: number;
  };
}

export interface TeacherAssignmentsResponse extends PageInfo {
  message: string;
  assignments: TeacherAssignment[];
}

export interface TeacherSubmission extends StudentSubmission {
  student: {
    id: string;
    enrollmentCode: string;
    user: {
      firstName: string;
      lastName: string;
    };
  };
}

export interface AssignmentSubmissionsResponse extends PageInfo {
  message: string;
  submissions: TeacherSubmission[];
}
