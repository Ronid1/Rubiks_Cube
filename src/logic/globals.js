export const ROW_SIZE = 3;
export const DIRECTIONS = { clockwise: 1, counterClockwise: -1 };
export const PLANES = {
  x: ['front', 'right', 'back', 'left'],
  y: ['right', 'bottom', 'left', 'top'],
  z: ['front', 'top', 'back', 'bottom'],
};
export const CHAIN_REACTION = {
    x: {0:'top', [ROW_SIZE-1]:'bottom'},
    y: {0:'back', [ROW_SIZE-1]:'front'},
    z: {0:'left', [ROW_SIZE-1]:'right'}
}
export const COLORS = ["red", "#e8651a", "yellow", "white", "green", "blue"];