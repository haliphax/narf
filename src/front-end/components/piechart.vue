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

      for (let [k, v] of this.data.entries()) {
        const percent = v / total;

        slices.push({
          key: k,
          percent: percent,
          index: 0,
          rotation: rotation,
          votes: v,
        });
        rotation += 360 * percent;
      };

      return slices
        .sort((a, b) => b.votes - a.votes)
        .map((v, i, a) => {
          v.index = i;

          if (i === a.length - 1)
            v.percent = Math.ceil(v.percent * 10000) / 10000;

          return v;
        });
    },
  },
  methods: {
    styles(slice: slice) {
      const output: Array<string> = [];

      output.push(`--i:${slice.index}`);
      output.push(`--p:${slice.percent}`);
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
        <label>
          <span>{{ s.key }}</span>
        </label>
      </div>
    </div>
  </div>
  <div class="key">
    <h3>Results</h3>
    <table>
      <thead>
        <tr>
          <th>Key</th>
          <th>Value</th>
          <th>Votes</th>
          <th><abbr title="Percentage">%</abbr></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="s, idx in slices">
          <td>
            <span :class="`color color_${idx}`" :id="`slice_color_${s.key}`"
              :style="styles(s)">
            </span>
          </td>
          <td>{{ s.key }}</td>
          <td>{{ s.votes }}</td>
          <td>{{ (s.percent * 100).toFixed(2) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
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
  -webkit-text-stroke: 1px #000;
  color: #fff;
  display: block;
  font-size: 4rem;
  height: 100%;
  padding: 1rem;
  position: absolute;
  stroke-width: 1px;
  stroke: 1px #000;
  text-align: center;
  transform: rotate(calc(var(--p) * 180deg));
  width: 100%;
}

.slice label span {
  display: block;
  transform: rotate(calc(var(--p) * -180deg - var(--r)));
}

table {
  border: solid var(--color);
  border-spacing: 0;
  border-width: 1px 1px 0 0;
  width: 100%;
}

thead {
  background-color: var(--color);
  color: var(--secondary-color);
}

tr:nth-child(2n) {
  background-color: var(--bg-color);
}

th, td {
  border: solid var(--color);
  border-width: 0 0 1px 1px;
  border-collapse: collapse;
  margin: 0;
  padding: 0.25rem .5rem;
}

tr > td:first-child {
  text-align: center;
}

.color {
  background-color: var(--c);
  border: 1px solid var(--outline-color);
  display: inline-block;
  height: 1em;
  margin-right: .25em;
  width: 1em;
}

.color_0 {
  --c: #002b36;
}

.color_1 {
  --c: #b58900;
}

.color_2 {
  --c: #d33682;
}

.color_3 {
  --c: #6c71c4;
}

.color_4 {
  --c: #859900;
}
</style>
