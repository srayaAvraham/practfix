import consumerRabbit from './services/rabbitConsumer';
import mailSender from './services/mailService';

// Connect to rabbitMQ and send mail 
consumerRabbit(mailSender);
