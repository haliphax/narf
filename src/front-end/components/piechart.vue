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
          index: 0,
          rotation: rotation,
          votes: v,
        });
        index++;
        rotation += Math.ceil(360 * percent);
      };

      return slices
        .sort((a, b) => b.votes - a.votes)
        .map((v, i) => {
          v.index = i;
          return v;
        });
    },
  },
  methods: {
    styles(slice: slice) {
      const output: Array<string> = [];

      output.push(`--p:${slice.percent}`);
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
    <div v-for="s, idx in slices" :style="styles(s)">
      <div :class="`slice color_${idx}`">
        <label>{{ s.key }}</label>
      </div>
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
  aspect-ratio: 1;
  gap: 0;
  margin: 0;
  padding: 0;
  position: relative;
}

.pie > div {
  position: absolute;
  width: 100%;
}

.slice {
  aspect-ratio: 1;
  place-content: center;
  position: relative;
  transform: rotate(var(--r));
  top: 0;
}

.slice::before {
  background: conic-gradient(var(--c) calc(var(--p) * 100%), #0000 0);
  border-radius: 50%;
  content: '';
  display: block;
  inset: 0;
  position: absolute;
}

.slice label {
  -webkit-text-stroke: 1px black;
  color: #fff;
  display: block;
  font-size: 4rem;
  position: absolute;
  height: 100%;
  width: 100%;
  stroke-width: 1px;
  stroke: 1px black;
  text-align: center;
  transform: rotate(calc(var(--p) * 180deg));
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
