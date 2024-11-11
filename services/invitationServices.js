import axios from 'axios';

export const sendInvitation = async (data) => {
    const response = await axios.post(`http://${process.env.BASE_URL}/invites/invite`, data);
    return response.data;
};

export const getInvitationsByInvitee = async (inviteeEmail) => {
    try {
        const response = await axios.get(`http://${process.env.BASE_URL}/invites/invitee`, {
            params: { inviteeEmail },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching invitations for invitee:", error);
        throw error;
    }
};

export const updateInvitationStatus = async (invitationId, status) => {
    try {
        const response = await axios.put(`http://${process.env.BASE_URL}/invites/${invitationId}/status`, { status });
        return response.data;
    } catch (error) {
        console.error("Error updating invitation status:", error);
        throw error;
    }
};
