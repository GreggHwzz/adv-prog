export interface Review {
    id: string;      
    answer: number;   
    commentary: string | null;
    studentId: string | null; 
    questionId: string;
    formId: string;      
  }