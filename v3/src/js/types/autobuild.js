// @flow
import type {
  ClassNo,
  LessonType,
  ModuleCode,
} from 'types/modules';

export type FreedayPreferences = {
  Mon?: Boolean,
  Tue?: Boolean,
  Wed?: Boolean,
  Thu?: Boolean,
  Fri?: Boolean,
  Any?: Boolean,
};

export type ModuleLessonConfigAutobuild = {
  [key: LessonType]: ClassNo,
  status: string
};

export type Autobuild = {
  freeday?: Boolean,
  workload?: number,
  freedayPreferences?: FreedayPreferences,
  afterOption?: Boolean,
  beforeOption?: Boolean,
  noLessonsBefore?: number,
  noLessonsAfter?: number,
  [key: ModuleCode]: ModuleLessonConfigAutobuild,
};
