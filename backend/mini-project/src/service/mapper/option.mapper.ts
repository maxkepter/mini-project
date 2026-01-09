import { Option } from 'src/domain/entities';
import { OptionResponse } from '../dto/response/option.response';
import { OptionRequest } from '../dto/request/option.request';

export class OptionMapper {
  static toResponse(option: Option): OptionResponse {
    const optionResponse = new OptionResponse();
    optionResponse.optionId = option.optionId;
    optionResponse.content = option.content;
    optionResponse.isCorrect = option.isCorrect;
    return optionResponse;
  }
  static toEntity(request: OptionRequest): Option {
    const option = new Option();
    option.content = request.content;
    option.isCorrect = request.isCorrect;
    return option;
  }
}
