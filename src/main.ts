import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Booking Friends API')
    .setDescription('The Booking Friends API is a robust and user-friendly interface designed to streamline and enhance the experience of booking travel and accommodation. It enables seamless integration with various booking systems, allowing users to search, compare, and reserve hotels, flights, and other travel services with ease. This API is particularly beneficial for travel agencies, hospitality businesses, and individual travelers seeking a convenient and efficient way to manage their travel plans.')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Booking')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('booking-api', app, document);
  await app.listen(3000); 
}
bootstrap();