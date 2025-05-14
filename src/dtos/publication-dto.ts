// import { Publication } from '@prisma/client';

// export interface publicationRequestDto {
//   media: string;
//   description: string;
//   restaurant_id: { id: string };
//   user_id : string;
// }

// export class publicationResponseDto {
//   user_id: string ;

//   constructor (data: publicationResponseDto ) {
//     this.user_id = data.user_id;
//   }
//   static fromEntity(entity : Publication) : publicationResponseDto {
//     return new publicationResponseDto ({
//         user_id : entity.user_id,
//     });
//   }
//   static fromEntities(entities: Publication[]): publicationResponseDto[] {
//     return entities.map(publicationResponseDto.fromEntity);
//   }

// }
