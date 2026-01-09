import { DataSource } from 'typeorm';
import { User } from './domain/entities/User.entity';
import { Exam } from './domain/entities/Exam.entity';
import { Question } from './domain/entities/Question.entity';
import { Option } from './domain/entities/Option.entity';
import { StudentExam } from './domain/entities/StudentExam.entity';
import { StudentExamQuestion } from './domain/entities/StudentExamQuestion.entity';
import { StudentExamAnswer } from './domain/entities/StudentExamAnswer.entity';
import { UserRole } from './domain/enum/UserRole.enum';
import { ExamStatus } from './domain/enum/ExamStatus.enum';
import { StudentExamStatus } from './domain/enum/StudentExamStatus.enum';
import { sha256 } from './utils/hash.utils';

async function seed() {
  const dataSource = new DataSource({
    type: 'mssql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '1433'),
    username: process.env.DB_USERNAME || 'sa',
    password: process.env.DB_PASSWORD || 'sa',
    database: process.env.DB_NAME || 'mini_project',
    entities: [
      User,
      Exam,
      Question,
      Option,
      StudentExam,
      StudentExamQuestion,
      StudentExamAnswer,
    ],
    synchronize: true,
    options: {
      encrypt: false,
      trustServerCertificate: true,
    },
  });

  try {
    await dataSource.initialize();
    console.log('Connected to database');

    // Clear existing data (optional - comment out if you want to keep existing data)
    try {
      await dataSource.query('DELETE FROM StudentExamAnswer');
      await dataSource.query('DELETE FROM StudentExamQuestion');
      await dataSource.query('DELETE FROM StudentExam');
      await dataSource.query('DELETE FROM ExamQuestion');
      await dataSource.query('DELETE FROM [Option]');
      await dataSource.query('DELETE FROM Question');
      await dataSource.query('DELETE FROM Exam');
      await dataSource.query('DELETE FROM [User]');
      console.log('Cleared existing data');
    } catch (error) {
      console.log('Note: Some tables may not exist yet, skipping delete');
    }

    // 1. Create Users
    const hashedPassword = sha256('password123');

    const admin = dataSource.getRepository(User).create({
      username: 'admin',
      password: hashedPassword,
      role: UserRole.ADMIN,
      isActive: true,
    });

    const teacher1 = dataSource.getRepository(User).create({
      username: 'teacher1',
      password: hashedPassword,
      role: UserRole.TEACHER,
      isActive: true,
    });

    const student1 = dataSource.getRepository(User).create({
      username: 'student1',
      password: hashedPassword,
      role: UserRole.STUDENT,
      isActive: true,
    });

    const student2 = dataSource.getRepository(User).create({
      username: 'student2',
      password: hashedPassword,
      role: UserRole.STUDENT,
      isActive: true,
    });

    const student3 = dataSource.getRepository(User).create({
      username: 'student3',
      password: hashedPassword,
      role: UserRole.STUDENT,
      isActive: true,
    });

    await dataSource
      .getRepository(User)
      .save([admin, teacher1, student1, student2, student3]);
    console.log('Created users');

    // 2. Create Questions with Options
    const question1 = dataSource.getRepository(Question).create({
      content: 'TypeScript là gì?',
    });
    await dataSource.getRepository(Question).save(question1);

    const q1Options = [
      dataSource.getRepository(Option).create({
        content: 'Một ngôn ngữ lập trình mở rộng của JavaScript',
        isCorrect: true,
        questionId: question1.questionId,
      }),
      dataSource.getRepository(Option).create({
        content: 'Một framework frontend',
        isCorrect: false,
        questionId: question1.questionId,
      }),
      dataSource.getRepository(Option).create({
        content: 'Một hệ quản trị cơ sở dữ liệu',
        isCorrect: false,
        questionId: question1.questionId,
      }),
      dataSource.getRepository(Option).create({
        content: 'Một thư viện CSS',
        isCorrect: false,
        questionId: question1.questionId,
      }),
    ];
    await dataSource.getRepository(Option).save(q1Options);

    const question2 = dataSource.getRepository(Question).create({
      content: 'REST API viết tắt của gì?',
    });
    await dataSource.getRepository(Question).save(question2);

    const q2Options = [
      dataSource.getRepository(Option).create({
        content:
          'Representational State Transfer Application Programming Interface',
        isCorrect: true,
        questionId: question2.questionId,
      }),
      dataSource.getRepository(Option).create({
        content: 'Real Estate State Transfer API',
        isCorrect: false,
        questionId: question2.questionId,
      }),
      dataSource.getRepository(Option).create({
        content: 'Remote System Transfer API',
        isCorrect: false,
        questionId: question2.questionId,
      }),
      dataSource.getRepository(Option).create({
        content: 'Responsive State Transaction API',
        isCorrect: false,
        questionId: question2.questionId,
      }),
    ];
    await dataSource.getRepository(Option).save(q2Options);

    const question3 = dataSource.getRepository(Question).create({
      content: 'NestJS sử dụng mô hình kiến trúc nào?',
    });
    await dataSource.getRepository(Question).save(question3);

    const q3Options = [
      dataSource.getRepository(Option).create({
        content: 'MVC (Model-View-Controller)',
        isCorrect: true,
        questionId: question3.questionId,
      }),
      dataSource.getRepository(Option).create({
        content: 'MVP (Model-View-Presenter)',
        isCorrect: false,
        questionId: question3.questionId,
      }),
      dataSource.getRepository(Option).create({
        content: 'MVVM (Model-View-ViewModel)',
        isCorrect: false,
        questionId: question3.questionId,
      }),
      dataSource.getRepository(Option).create({
        content: 'MVT (Model-View-Template)',
        isCorrect: false,
        questionId: question3.questionId,
      }),
    ];
    await dataSource.getRepository(Option).save(q3Options);

    const question4 = dataSource.getRepository(Question).create({
      content: 'HTTP status code 404 có nghĩa là gì?',
    });
    await dataSource.getRepository(Question).save(question4);

    const q4Options = [
      dataSource.getRepository(Option).create({
        content: 'Not Found',
        isCorrect: true,
        questionId: question4.questionId,
      }),
      dataSource.getRepository(Option).create({
        content: 'Unauthorized',
        isCorrect: false,
        questionId: question4.questionId,
      }),
      dataSource.getRepository(Option).create({
        content: 'Bad Request',
        isCorrect: false,
        questionId: question4.questionId,
      }),
      dataSource.getRepository(Option).create({
        content: 'Internal Server Error',
        isCorrect: false,
        questionId: question4.questionId,
      }),
    ];
    await dataSource.getRepository(Option).save(q4Options);

    const question5 = dataSource.getRepository(Question).create({
      content: 'Promise trong JavaScript dùng để làm gì?',
    });
    await dataSource.getRepository(Question).save(question5);

    const q5Options = [
      dataSource.getRepository(Option).create({
        content: 'Xử lý bất đồng bộ',
        isCorrect: true,
        questionId: question5.questionId,
      }),
      dataSource.getRepository(Option).create({
        content: 'Tạo vòng lặp',
        isCorrect: false,
        questionId: question5.questionId,
      }),
      dataSource.getRepository(Option).create({
        content: 'Khai báo biến',
        isCorrect: false,
        questionId: question5.questionId,
      }),
      dataSource.getRepository(Option).create({
        content: 'Tạo object',
        isCorrect: false,
        questionId: question5.questionId,
      }),
    ];
    await dataSource.getRepository(Option).save(q5Options);

    console.log('Created questions and options');

    // 3. Create Exams
    const exam1 = dataSource.getRepository(Exam).create({
      name: 'Kiểm tra TypeScript cơ bản',
      duration: 30,
      status: ExamStatus.PUBLISHED,
    });
    await dataSource.getRepository(Exam).save(exam1);

    const exam2 = dataSource.getRepository(Exam).create({
      name: 'Thi giữa kỳ - Web Development',
      duration: 60,
      status: ExamStatus.PUBLISHED,
    });
    await dataSource.getRepository(Exam).save(exam2);

    const exam3 = dataSource.getRepository(Exam).create({
      name: 'Bài kiểm tra NestJS',
      duration: 45,
      status: ExamStatus.DRAFT,
    });
    await dataSource.getRepository(Exam).save(exam3);

    console.log('Created exams');

    // Link questions to exams using TypeORM relations
    exam1.questions = [question1, question2];
    await dataSource.getRepository(Exam).save(exam1);

    exam2.questions = [question1, question3, question4, question5];
    await dataSource.getRepository(Exam).save(exam2);

    exam3.questions = [question3];
    await dataSource.getRepository(Exam).save(exam3);

    console.log('Linked questions to exams');

    // 4. Create StudentExams
    const studentExam1 = dataSource.getRepository(StudentExam).create({
      userId: student1.userId,
      examId: exam1.examId,
      status: StudentExamStatus.SUBMITTED,
      startTime: new Date('2026-01-05T09:00:00'),
      submitTime: new Date('2026-01-05T09:25:00'),
    });

    const studentExam2 = dataSource.getRepository(StudentExam).create({
      userId: student2.userId,
      examId: exam1.examId,
      status: StudentExamStatus.SUBMITTED,
      startTime: new Date('2026-01-05T09:00:00'),
      submitTime: new Date('2026-01-05T09:28:00'),
    });

    const studentExam3 = dataSource.getRepository(StudentExam).create({
      userId: student1.userId,
      examId: exam2.examId,
      status: StudentExamStatus.IN_PROGRESS,
      startTime: new Date('2026-01-06T10:00:00'),
      submitTime: null,
    });

    await dataSource
      .getRepository(StudentExam)
      .save([studentExam1, studentExam2, studentExam3]);
    console.log('Created student exams');

    // 5. Create StudentExamQuestions and StudentExamAnswers for studentExam1
    const seQuestion1 = dataSource.getRepository(StudentExamQuestion).create({
      content: question1.content,
      studentExamId: studentExam1.studentExamId,
    });
    await dataSource.getRepository(StudentExamQuestion).save(seQuestion1);

    for (const option of q1Options) {
      const seAnswer = dataSource.getRepository(StudentExamAnswer).create({
        content: option.content,
        isCorrect: option.isCorrect,
        isSelected: option.isCorrect, // Student1 answered correctly
        studentExamQuestionId: seQuestion1.studentExamQuestionId,
      });
      await dataSource.getRepository(StudentExamAnswer).save(seAnswer);
    }

    const seQuestion2 = dataSource.getRepository(StudentExamQuestion).create({
      content: question2.content,
      studentExamId: studentExam1.studentExamId,
    });
    await dataSource.getRepository(StudentExamQuestion).save(seQuestion2);

    for (const option of q2Options) {
      const seAnswer = dataSource.getRepository(StudentExamAnswer).create({
        content: option.content,
        isCorrect: option.isCorrect,
        isSelected: option.isCorrect, // Student1 answered correctly
        studentExamQuestionId: seQuestion2.studentExamQuestionId,
      });
      await dataSource.getRepository(StudentExamAnswer).save(seAnswer);
    }

    console.log(
      'Created student exam questions and answers for student1-exam1',
    );

    // 6. Create StudentExamQuestions and StudentExamAnswers for studentExam2
    const seQuestion3 = dataSource.getRepository(StudentExamQuestion).create({
      content: question1.content,
      studentExamId: studentExam2.studentExamId,
    });
    await dataSource.getRepository(StudentExamQuestion).save(seQuestion3);

    for (let i = 0; i < q1Options.length; i++) {
      const option = q1Options[i];
      const seAnswer = dataSource.getRepository(StudentExamAnswer).create({
        content: option.content,
        isCorrect: option.isCorrect,
        isSelected: i === 1, // Student2 selected wrong answer (index 1)
        studentExamQuestionId: seQuestion3.studentExamQuestionId,
      });
      await dataSource.getRepository(StudentExamAnswer).save(seAnswer);
    }

    const seQuestion4 = dataSource.getRepository(StudentExamQuestion).create({
      content: question2.content,
      studentExamId: studentExam2.studentExamId,
    });
    await dataSource.getRepository(StudentExamQuestion).save(seQuestion4);

    for (const option of q2Options) {
      const seAnswer = dataSource.getRepository(StudentExamAnswer).create({
        content: option.content,
        isCorrect: option.isCorrect,
        isSelected: option.isCorrect, // Student2 answered correctly
        studentExamQuestionId: seQuestion4.studentExamQuestionId,
      });
      await dataSource.getRepository(StudentExamAnswer).save(seAnswer);
    }

    console.log(
      'Created student exam questions and answers for student2-exam1',
    );

    console.log('✅ Seed data completed successfully!');
    console.log('\nSummary:');
    console.log(`- Users: ${5} (1 admin, 1 teacher, 3 students)`);
    console.log(`- Questions: ${5} with ${20} options`);
    console.log(`- Exams: ${3}`);
    console.log(`- Student Exams: ${3}`);
    console.log('\nDefault credentials:');
    console.log('  Username: admin/teacher1/student1/student2/student3');
    console.log('  Password: password123');
  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  } finally {
    await dataSource.destroy();
  }
}

seed()
  .then(() => {
    console.log('Seed process finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seed process failed:', error);
    process.exit(1);
  });
