import { Injectable } from '@nestjs/common';

export type User = {
  userId: number;
  username: string;
  firstName: string;
  role: string;
  email: string;
  phone: string;
  password: string;
  profilePhoto: string;
  description?: string;
  cinNumber: string; // Use cinNumber as a unique identifier
};
@Injectable()
export class UserService {
  private readonly users: User[] = [];

  async create(username: string, firstName: string, role: string, email: string, phone: string, password: string, profilePhoto: string, description: string = '', cinNumber: string): Promise<User> {
    if (this.users.some(user => user.email === email || user.cinNumber === cinNumber)) {
      throw new Error('Email or CIN number is already in use');
    }

    const user = {
      userId: this.users.length + 1,
      username,
      firstName,
      role,
      email,
      phone,
      password,
      profilePhoto,
      description,
      cinNumber
    };
    this.users.push(user);
    return user;
  }
  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }
  async findOneByCin(cinNumber: string): Promise<User | undefined> {
    return this.users.find(user => user.cinNumber === cinNumber);
  }

  async findById(userId: number): Promise<User | undefined> {
    return this.users.find(user => user.userId === userId);
  }

  async findAllByRole(role: string): Promise<User[]> {
    if (role === 'boss') {
      return this.users;
    }
    return this.users.filter(user => user.role === role);
  }

  async updateProfile(cinNumber: string, updates: Partial<User>): Promise<User | undefined> {
    console.log('Updating profile for CIN:', cinNumber);
    const user = this.users.find(user => user.cinNumber === cinNumber);
    if (user) {
      console.log('User found:', user);
      if (updates.username) user.username = updates.username;
      if (updates.email) user.email = updates.email;
      if (updates.description) user.description = updates.description;
      if (updates.password) user.password = updates.password;
      return user;
    } else {
      console.error('User not found for CIN:', cinNumber);
    }
    return undefined;
  }
  getCurrentUsername(): string {
    // Logic to get the current username, e.g., from local storage
    return localStorage.getItem('currentUsername') || 'Guest';
  }
}
