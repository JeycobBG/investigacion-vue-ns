<template>
    <Page>
        <ActionBar title="Usuarios" />
        <GridLayout rows="auto, *" columns="*">
            <Button text="Crear Usuario" @tap="openCreateModal" row="0" class="create-button" />
            <GridLayout row="1" rows="*">
                <ActivityIndicator :busy="isLoading" rowSpan="1" />
                <ListView 
                    :key="listKey" 
                    for="user in users" 
                    @itemTap="onItemTap" 
                    class="user-list"
                    row="0"
                    height="100%">
                    <v-template>
                        <GridLayout columns="*, auto" class="user-item">
                            <Label :text="user.name" col="0" class="username" />
                            <StackLayout orientation="horizontal" col="1">
                                <Button text="✏️" @tap="openEditModal(user)" class="edit-button" />
                                <Button text="🗑️" @tap="confirmDelete(user)" class="delete-button" />
                            </StackLayout>
                        </GridLayout>
                    </v-template>
                </ListView>
            </GridLayout>
        </GridLayout>
    </Page>
</template>

<script>
import UserModal from './UserModal.vue';
import { Dialogs } from '@nativescript/core';

export default {
    components: { UserModal },
    data() {
        return {
            users: [],
            listKey: 0,
            isLoading: false,
        };
    },
    mounted() {
        this.fetchUsers();
    },
    methods: {
        async fetchUsers() {
            this.isLoading = true;
            try {
                const res = await fetch('http://10.0.2.2:5140/api/User', {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                });

                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(`Error al obtener usuarios: ${res.status} ${res.statusText}`);
                }

                const data = await res.json();
                const mappedData = data.map(user => ({
                    id: user.id || user.Id,
                    name: user.name || user.Name,
                    email: user.email || user.Email,
                }));

                this.users = [...mappedData];
            } catch (err) {
                await Dialogs.alert({
                    title: 'Error',
                    message: err.message || 'No se pudo conectar al servidor',
                    okButtonText: 'OK',
                });
            } finally {
                this.isLoading = false;
            }
        },
        
        openCreateModal() {
            this.$showModal(UserModal, {
                props: {
                    userData: { id: null, name: '', email: '' },
                    isEditMode: false
                },
                fullscreen: false,
            }).then((result) => {
                if (result === 'refresh') {
                    this.refreshPage();
                }
            });
        },
        
        openEditModal(user) {
            this.$showModal(UserModal, {
                props: {
                    userData: {
                        id: user.id,
                        name: user.name,
                        email: user.email
                    },
                    isEditMode: true
                },
                fullscreen: false,
            }).then((result) => {
                if (result === 'refresh') {
                    this.refreshPage();
                }
            });
        },
        
        onItemTap(event) {
            const user = event.item;
            this.openEditModal(user);
        },
        
        async confirmDelete(user) {
            const result = await Dialogs.confirm({
                title: 'Confirmar eliminación',
                message: `¿Eliminar usuario ${user.name}?`,
                okButtonText: 'Sí',
                cancelButtonText: 'No',
            });
            if (result) {
                await this.deleteUser(user.id);
            }
        },
        
        async deleteUser(id) {
            this.isLoading = true;
            try {
                const res = await fetch(`http://10.0.2.2:5140/api/User/${id}`, {
                    method: 'DELETE',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                });

                if (!res.ok) {
                    const error = await res.json();
                    throw new Error(error.message || 'Error al eliminar');
                }

                await Dialogs.alert({
                    title: 'Éxito',
                    message: 'Usuario eliminado',
                    okButtonText: 'OK',
                });

                this.refreshPage();
            } catch (err) {
                await Dialogs.alert({
                    title: 'Error',
                    message: err.message || 'No se pudo eliminar el usuario',
                    okButtonText: 'OK',
                });
            } finally {
                this.isLoading = false;
            }
        },
        
        refreshPage() {
            this.fetchUsers().then(() => {
                this.listKey += 1;
            });
        },
    },
};
</script>

<style scoped>
.user-item {
    padding: 10;
    border-bottom-width: 1;
    border-color: #ccc;
}
.username {
    font-size: 16;
    vertical-align: center;
}
.create-button {
    background-color: #4CAF50;
    color: white;
    margin: 10;
}
.edit-button {
    background-color: #2196F3;
    color: white;
    margin-right: 5;
}
.delete-button {
    background-color: #F44336;
    color: white;
}
.user-list {
    margin: 10;
}
</style>