import { Option, Question } from 'src/domain/entities';
import { QuestionResponse } from '../dto/response/question.respone';
import { OptionResponse } from '../dto/response/option.response';
import { QuestionRequest } from '../dto/request/createQuestion.request';

export class QuestionMapper {
  static toResponse(question: Question): QuestionResponse {
    const response: QuestionResponse = new QuestionResponse();
    response.questionId = question.questionId;
    response.content = question.content;
    response.options = question.options.map((opt) => {
      const optionResponse = new OptionResponse();
      optionResponse.optionId = opt.optionId;
      optionResponse.content = opt.content;
      optionResponse.isCorrect = opt.isCorrect;
      return optionResponse;
    });
    return response;
  }
  static toEntity(request: QuestionRequest): Question {
    const question = new Question();
    question.content = request.content;
    question.options = request.options.map((opt) => {
      const option = Option.create(opt.content, opt.isCorrect);
      return option;
    });
    return question;
  }
}
