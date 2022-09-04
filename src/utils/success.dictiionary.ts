import { ApiResponse } from './respose.entity';
import { User } from '../auth/entities/user.entity';

export const ApiResponses = <T extends Record<string, ApiResponse>>(
  arg: T,
): T => {
  return arg;
};

const Succes = ApiResponses({
  USER_REGISTER: {
    description: 'El registro se completo con exito',
    status: 201,
    type: User,
  },
  LOGIN_USER: {
    description: 'Se inicio secion correctamente',
    status: 201,
    type: User,
  },
});
export default Succes;
