/* One contract for preview, scrubbing and export. Times are seconds, frames zero based. */
globalThis.SF = globalThis.SF || {};
SF.Timeline = (() => {
  const steps = s => s.playbackMode === 'ping_pong' && s.rangeEnd > s.rangeStart
    ? 2 * (s.rangeEnd - s.rangeStart) : s.rangeEnd - s.rangeStart + 1;
  const rate = s => s.sourceFps * s.playbackSpeedPercent / 100;
  const duration = s => steps(s) / rate(s);
  function sourceAt(s, step) {
    const n = s.rangeEnd - s.rangeStart + 1, length = steps(s);
    const q = Math.max(0, Math.min(length - 1, step));
    return s.rangeStart + (s.playbackMode === 'ping_pong' && q >= n ? length - q : q);
  }
  function schedule(s) {
    const end = duration(s), entries = [];
    // Tolerance removes only a floating-point phantom sample at the exclusive boundary.
    const count = Math.ceil(end * s.displayFps - 1e-10);
    for (let k = 0; k < count; k++) {
      const start = k / s.displayFps, stop = Math.min((k + 1) / s.displayFps, end);
      const frame = sourceAt(s, Math.floor(start * rate(s) + 1e-10));
      const previous = entries.at(-1);
      if (previous?.frame === frame) { previous.endSeconds = stop; previous.holdSeconds = stop - previous.startSeconds; }
      else entries.push({ startSeconds: start, endSeconds: stop, holdSeconds: stop - start, frame });
    }
    return { sampling: 'loop_local_hold_v1', durationSeconds: end, sampleCount: count,
      playbackMode: s.playbackMode, repeat: s.playbackMode !== 'once',
      endBehavior: s.playbackMode === 'once' ? 'hold_final_source_frame' : 'restart_cycle', entries };
  }
  function at(s, elapsed) {
    const end = duration(s);
    if (s.playbackMode === 'once' && elapsed >= end) return s.rangeEnd;
    const local = ((elapsed % end) + end) % end;
    const sampled = Math.floor(local * s.displayFps + 1e-10) / s.displayFps;
    return sourceAt(s, Math.floor(sampled * rate(s) + 1e-10));
  }
  return { steps, rate, duration, sourceAt, schedule, at };
})();
