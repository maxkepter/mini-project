import { StudentExam } from 'src/domain/entities';
import { StudentExamResponse } from '../dto/response/studentExam.response';
import { StudentExamQuestionMapper } from './studentExamQuestion.mapper';

export class StudentExamMapper {
  static toResponse(
    entity: StudentExam,
    isReloaded: boolean = false,
  ): StudentExamResponse {
    const response = new StudentExamResponse();
    response.studentExamId = entity.studentExamId;
    response.status = entity.status;
    response.startTime = entity.startTime;
    response.submitTime = entity.submitTime;
    response.score = entity.score;
    response.userId = entity.userId;
    response.examId = entity.examId;
    response.username = entity.user?.username || '';
    response.examName = entity.exam?.name || '';
    response.duration = entity.exam?.duration || 0;
    response.studentExamQuestions = (entity.studentExamQuestions || []).map(
      (question) => StudentExamQuestionMapper.toResponse(question),
    );
    response.isReloaded = isReloaded;
    return response;
  }
}
