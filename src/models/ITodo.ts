export type TodoId = string;

export interface ITodo {
  id: TodoId,
  listId: string,
  title: string,
  description?: string,
  /**
   * Дата создания todo в виде строки ISO.
   */
  addedAt: string,
  /**
   * Позиция todo в списке задач. Поле необходимо для позиционирования.
   * Предполагается, что position >= 0:
   */
  position: number
}
