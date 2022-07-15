import { ActionContext, Module } from 'vuex';
import { participant, participantsState } from '../../types';

export const participantsModule: Module<participantsState, any> = {
	actions: {
		addParticipant(
			ctx: ActionContext<participantsState, any>,
			payload: participant,
		) {
			const person: participant = {
				id: payload.id,
				name: payload.name,
			};
			const people = ctx.state.people;

			if (people.hasOwnProperty(payload.id))
				person.value = people[payload.id].value;

			people[payload.id] = person;
			ctx.commit('participants.people', people);
		},
	},
	mutations: {
		'participants.people'(
			state: participantsState,
			payload: Record<string, participant>,
		) {
			state.people = payload;
		},
	},
	state(): participantsState {
		return { people: {} };
	},
};
