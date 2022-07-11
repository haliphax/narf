<script lang="ts">
import { Component } from 'vue';

type slice = {
  key: string,
  percent: number,
  index: number,
  rotation: number,
  votes: number,
};

const PieChart: Component = {
  computed: {
    slices() {
      const data = this.data as Map<string, number>;
      const slices: Array<slice> = [];
      const valIter = data.values();
      let value: IteratorResult<number, any>;
      let total = 0;
      let rotation = 0;

      while (value = valIter.next()) {
        if (value.done) break;
        total += value.value;
      }

      let index = 0;

      for (let [k, v] of this.data.entries()) {
        const percent = v / total;

        slices.push({
          key: k,
          percent: percent,
          index: index,
          rotation: rotation,
          votes: v,
        });
        index++;
        rotation += (360 * percent);
      };

      return slices.sort((a, b) => a.votes - b.votes);
    },
  },
  methods: {
    styles(slice: slice) {
      const output: Array<string> = [];

      output.push(`--p:${slice.percent * 100}`);
      output.push(`--i:${slice.index}`);
      output.push(`--r:${slice.rotation}deg`);

      return output.join(';');
    }
  },
  props: ['data'],
};

export default PieChart;
</script>

<template>
  <div class="pie">
    <div v-for="s, idx in slices" :class="`slice color_${idx}`"
      :style="styles(s)">
    </div>
  </div>
  <div class="key">
    <h3>Key</h3>
    <ul>
      <li v-for="s, idx in slices">
        <span :class="`color color_${idx}`" :id="`slice_color_${s.key}`"
          :style="styles(s)">
        </span>
        <label :for="`slice_color_${s.key}`">
          {{ s.key }}: {{ s.votes }} vote(s)
        </label>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.color {
  background-color: var(--c);
  display: inline-block;
  height: 1em;
  margin-right: .25em;
  width: 1em;
}

.pie {
  gap: 0;
  margin: 0;
  padding: 0;
  position: relative;
}

.slice {
  aspect-ratio: 1;
  height: 100%;
  margin: 0;
  margin-top: calc(-100% * var(--i));
  place-content: center;
  position: relative;
  width: 100%;
}

.slice::before {
  content: '';
  display: block;
  position: absolute;
  border-radius: 50%;
  inset: 0;
  background:
    conic-gradient(from var(--r), var(--c) calc(var(--p) * 1%), #0000 0);
}

.color_0 {
  --c: #000;
}

.color_1 {
  --c: #fa0;
}

.color_2 {
  --c: #7f7;
}

.color_3 {
  --c: #faf;
}

.color_4 {
  --c: #00f;
}
</style>
