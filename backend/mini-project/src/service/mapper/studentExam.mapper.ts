import { StudentExam } from 'src/domain/entities';
import { StudentExamResponse } from '../dto/response/studentExam.response';
import { StudentExamQuestionMapper } from './studentExamQuestion.mapper';

export class StudentExamMapper {
  static toResponse(entity: StudentExam): StudentExamResponse {
    const response = new StudentExamResponse();
    response.studentExamId = entity.studentExamId;
    response.status = entity.status;
    response.startTime = entity.startTime;
    response.submitTime = entity.submitTime;
    response.score = entity.score;
    response.userId = entity.userId;
    response.examId = entity.examId;
    response.studentExamQuestions = (entity.studentExamQuestions || []).map(
      (question) => StudentExamQuestionMapper.toResponse(question),
    );
    return response;
  }
}
