import TeamService from '@/services/team.service';
import Team from '@/store/models/team';

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async init({ dispatch }) {
      dispatch('clients/terminate', null, { root: true });
      dispatch('bankAccounts/terminate', null, { root: true });
      dispatch('invoices/terminate', null, { root: true });

      await dispatch('getTeam');

      dispatch('clients/init', null, { root: true });
      dispatch('bankAccounts/init', null, { root: true });
      dispatch('invoices/init', null, { root: true });
    },
    async getTeam() {
      const team = await TeamService.getTeam();
      await Team.create({ data: team });
      return team;
    },
    async teamProps({ state }, props) {
      return Team.update({
        where: state.teamId,
        data: props,
      });
    },
    async updateTeam({ getters, dispatch }, props) {
      if (props) {
        await dispatch('teamProps', props);
      }
      return TeamService.updateTeam(getters.team);
    },
  },
  getters: {
    team() {
      return Team.query().first();
    },
    all() {
      return Team.query()
        .with(['logos'])
        .where('$isNew', false)
        .get();
    },
  },
};
