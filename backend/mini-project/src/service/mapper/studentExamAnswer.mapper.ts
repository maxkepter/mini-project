import { StudentExamAnswer } from 'src/domain/entities';
import { StudentExamAnswerResponse } from '../dto/response/studentExamAnswer.response';

export class StudentExamAnswerMapper {
  static toResponse(entity: StudentExamAnswer): StudentExamAnswerResponse {
    const response = new StudentExamAnswerResponse();
    response.studentExamAnswerId = entity.studentExamAnswerId;
    response.content = entity.content;
    response.isSelected = entity.isSelected;
    return response;
  }
}
