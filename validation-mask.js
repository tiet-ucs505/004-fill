class VisitationMask {
  m
  constructor() { this.m = BigInt(0) }
  set(n) { this.m |= (BigInt(1) << BigInt(n)) }
  at(n) { return (this.m >> BigInt(n)) & BigInt(1) }
}
