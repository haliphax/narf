import purge from "./purge";

const cronjobs = {
	jobs: [purge],
	start() {
		for (const job of this.jobs) job.start();
	},
	stop() {
		for (const job of this.jobs) job.stop();
	},
};

export default cronjobs;
