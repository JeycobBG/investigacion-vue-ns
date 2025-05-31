<template>
    <Page>
        <ActionBar title="Usuarios" />
        <GridLayout rows="auto, *" columns="*">
            <Button text="Crear Usuario" @tap="openCreateModal" row="0" class="create-button" />
            <StackLayout row="1">
                <ActivityIndicator :busy="isLoading" />
                <ListView :key="listKey" for="user in users" @itemTap="onItemTap" class="user-list">
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
            </StackLayout>
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
        console.log('---------------------------');
        console.log('Componente UserList montado');
        console.log('---------------------------');
        this.fetchUsers();
    },
    watch: {
        users(newUsers) {
            console.log('Lista de usuarios actualizada:', newUsers);
        },
    },
    methods: {
        async fetchUsers() {
            console.log('Obteniendo usuarios...');
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
                if (!Array.isArray(data)) {
                    throw new Error('La respuesta no es un array válido.');
                }

                // Mapear los datos para asegurar la estructura correcta
                const mappedData = data.map(user => ({
                    id: user.id || user.Id,
                    name: user.name || user.Name,
                    email: user.email || user.Email,
                }));

                console.log('Usuarios recibidos:', mappedData);
                this.$set(this, 'users', [...mappedData]);
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
            console.log('Abriendo modal para crear usuario');
            const options = {
                context: { user: null, mode: 'create' },
                fullscreen: false,
            };
            this.$showModal(UserModal, options).then((result) => {
                console.log('Resultado del modal:', result);
                if (result === 'refresh') {
                    this.refreshPage();
                }
            });
        },
        openEditModal(user) {
            console.log('Abriendo modal para editar usuario:', user);
            const options = {
                context: { user: { ...user }, mode: 'edit' },
                fullscreen: false,
            };
            this.$showModal(UserModal, options).then((result) => {
                console.log('Resultado del modal:', result);
                if (result === 'refresh') {
                    this.refreshPage();
                }
            });
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
            console.log('Eliminando usuario con ID:', id);
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
                    console.error('Error del backend:', error);
                    throw new Error(error.message || 'Error al eliminar');
                }

                console.log('Usuario eliminado correctamente.');
                await Dialogs.alert({
                    title: 'Éxito',
                    message: 'Usuario eliminado',
                    okButtonText: 'OK',
                });

                this.refreshPage();
            } catch (err) {
                console.error('Error al eliminar usuario:', err);
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
            console.log('Refrescando lista de usuarios...');
            this.fetchUsers().then(() => {
                this.listKey += 1;
            });
        },
    },
};
</script>

// ...existing style...
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