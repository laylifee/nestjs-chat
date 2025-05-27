import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './entity/group.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
  ) {}

  // 获取用户的所有群组
  async findUserGroups(userId: number): Promise<Group[]> {
    return this.groupRepository
      .createQueryBuilder('group')
      .innerJoinAndSelect('group.users', 'user')
      .where('user.id = :userId', { userId })
      .getMany();
  }
}
