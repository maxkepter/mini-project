import { StudentExamQuestion } from 'src/domain/entities';
import { StudentExamQuestionResponse } from '../dto/response/studentExamQuestion.response';
import { StudentExamAnswerMapper } from './studentExamAnswer.mapper';

export class StudentExamQuestionMapper {
  static toResponse(entity: StudentExamQuestion): StudentExamQuestionResponse {
    const response = new StudentExamQuestionResponse();
    response.content = entity.content;
    response.options = (entity.studentExamAnswers || []).map((answer) =>
      StudentExamAnswerMapper.toResponse(answer),
    );
    return response;
  }
}
