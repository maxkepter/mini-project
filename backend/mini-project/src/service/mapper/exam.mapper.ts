import { Exam } from 'src/domain/entities';
import { ExamResponse } from '../dto/response/exam.respone';
import { QuestionMapper } from './question.mapper';

export class ExamMapper {
  static toResponse(exam: Exam): ExamResponse {
    const examResponse = new ExamResponse();
    examResponse.examId = exam.examId;
    examResponse.name = exam.name;
    examResponse.duration = exam.duration;
    examResponse.status = exam.status;
    examResponse.questions = exam.questions.map((q) =>
      QuestionMapper.toResponse(q),
    );
    return examResponse;
  }
}
