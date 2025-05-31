<template>
    <Page>
        <ActionBar title="Usuarios" />
        <GridLayout rows="auto, *" columns="*">
            <Button text="Crear Usuario" @tap="openCreateModal" row="0" class="create-button" />
            <StackLayout row="1">
                <ActivityIndicator :busy="isLoading" />
                <ListView v-if="listViewVisible" :key="listKey" for="user in users" @itemTap="onItemTap"
                    class="user-list">
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
        
        <!-- Modal -->
        <UserModal
            v-if="modalVisible"
            :user="selectedUser"
            :mode="modalMode"
            @close="onModalClose"
            @refreshUsers="refreshPage"
        />
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
            listKey: 0, // Usado para forzar el render del ListView
            listViewVisible: true, // Control de visibilidad para forzar reconstrucción
            modalVisible: false,
            modalMode: 'create',
            selectedUser: null,
            isLoading: false,
        };
    },
    mounted() {
        console.log('---------------------------');
        console.log('Componente UserList montado');
        console.log('---------------------------');

        this.fetchUsers();
    },
    methods: {
        async fetchUsers() {
            this.isLoading = true;
            try {
                const res = await fetch('http://10.0.2.2:5140/api/User');
                if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
                
                const data = await res.json();
                this.users = Array.isArray(data) ? data : [];
            } catch (err) {
                console.error('Error al obtener usuarios:', err);
                Dialogs.alert({
                    title: 'Error',
                    message: 'No se pudieron cargar los usuarios',
                    okButtonText: 'OK'
                });
            } finally {
                this.isLoading = false;
            }
        },
        openCreateModal() {
            this.selectedUser = null;
            this.modalMode = 'create';
            this.modalVisible = true;
        },
        openEditModal(user) {
            this.selectedUser = { ...user };
            this.modalMode = 'edit';
            this.modalVisible = true;
        },
        async confirmDelete(user) {
            const confirm = await Dialogs.confirm({
                title: 'Confirmar',
                message: `¿Eliminar a ${user.name}?`,
                okButtonText: 'Sí',
                cancelButtonText: 'No'
            });
            if (confirm) await this.deleteUser(user.id);
        },
        async deleteUser(id) {
            this.isLoading = true;
            try {
                const res = await fetch(`http://10.0.2.2:5140/api/User/${id}`, {
                    method: 'DELETE'
                });
                
                if (!res.ok) throw new Error('Error al eliminar');
                
                Dialogs.alert({
                    title: 'Éxito',
                    message: 'Usuario eliminado',
                    okButtonText: 'OK'
                });
                
                this.refreshPage();
            } catch (err) {
                Dialogs.alert({
                    title: 'Error',
                    message: 'No se pudo eliminar',
                    okButtonText: 'OK'
                });
            } finally {
                this.isLoading = false;
            }
        },
        onModalClose() {
            this.modalVisible = false;
        },
        refreshPage() {
            // Primero refrescamos los datos
            this.fetchUsers();
            
            // Luego recargamos la vista usando el Frame de Nativescript
            const frame = require('@nativescript/core/ui/frame').Frame;
            const currentPage = frame.topmost().currentPage;
            
            if (currentPage) {
                frame.topmost().navigate({
                    create: () => {
                        const Vue = require('nativescript-vue').default;
                        return new Vue({
                            template: `<UserList />`,
                            components: { UserList: this.$options }
                        }).$mount().$el.nativeView;
                    },
                    clearHistory: true
                });
            }
        }
    }
};
</script>

<style scoped>
.user-item {
    padding: 10;
    border-bottom-width: 1;
    border-color: #eee;
}
.username {
    font-size: 16;
    vertical-align: center;
}
.create-button {
    background-color: #4CAF50;
    color: white;
    margin: 10;
    border-radius: 5;
}
.edit-button {
    background-color: #2196F3;
    color: white;
    margin-right: 5;
    border-radius: 5;
}
.delete-button {
    background-color: #F44336;
    color: white;
    border-radius: 5;
}
.user-list {
    margin: 10;
}
</style>