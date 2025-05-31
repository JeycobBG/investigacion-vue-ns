<template>
    <GridLayout rows="auto, auto, auto, auto" padding="20" backgroundColor="white">
        <Label row="0" :text="isEditMode ? 'Editar Usuario' : 'Crear Usuario'" class="modal-title" />
        <TextField row="1" hint="Nombre" v-model="formData.name" class="input-field" />
        <TextField row="2" hint="Email" v-model="formData.email" keyboardType="email" class="input-field" />
        <StackLayout row="3" orientation="horizontal" horizontalAlignment="right" marginTop="20">
            <Button text="Cancelar" @tap="closeModal" class="btn btn-cancel" />
            <Button 
                :text="isEditMode ? 'Actualizar' : 'Crear'" 
                @tap="handleSubmit" 
                class="btn btn-primary" 
            />
            <Button
                v-if="isEditMode"
                text="Eliminar"
                @tap="confirmDelete"
                class="btn btn-danger"
                marginLeft="10"
            />
        </StackLayout>
    </GridLayout>
</template>

<script>
import * as dialogs from '@nativescript/core/ui/dialogs';

export default {
    props: {
        userData: {
            type: Object,
            default: () => ({
                id: null,
                name: '',
                email: ''
            })
        },
        isEditMode: {
            type: Boolean,
            default: false
        }
    },
    
    data() {
        return {
            formData: {
                id: null,
                name: '',
                email: ''
            }
        };
    },
    
    watch: {
        userData: {
            immediate: true,
            handler(newUserData) {
                // Update formData whenever userData changes
                this.formData = {
                    id: newUserData.id || null,
                    name: newUserData.name || '',
                    email: newUserData.email || ''
                };
            }
        },
        isEditMode(newValue) {
            console.log('isEditMode changed:', newValue);
        }
    },
    
    mounted() {
        console.log('Modal mounted with data:', this.formData);
        console.log('Edit mode:', this.isEditMode);
    },
    
    methods: {
        closeModal() {
            this.$modal.close();
        },
        
        async handleSubmit() {
            if (!this.validateFields()) return;
            
            try {
                const url = this.isEditMode
                    ? `http://10.0.2.2:5140/api/User/${this.formData.id}`
                    : 'http://10.0.2.2:5140/api/User';
                
                const method = this.isEditMode ? 'PUT' : 'POST';
                
                const response = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: this.formData.id,
                        name: this.formData.name,
                        email: this.formData.email
                    })
                });
                
                if (!response.ok) throw new Error('Error en la solicitud');
                
                await dialogs.alert({
                    title: 'Éxito',
                    message: this.isEditMode 
                        ? 'Usuario actualizado correctamente' 
                        : 'Usuario creado exitosamente',
                    okButtonText: 'OK'
                });
                
                this.$modal.close('refresh');
            } catch (error) {
                await dialogs.alert({
                    title: 'Error',
                    message: error.message || 'Ocurrió un error',
                    okButtonText: 'OK'
                });
            }
        },
        
        validateFields() {
            if (!this.formData.name.trim()) {
                dialogs.alert({
                    title: 'Error',
                    message: 'El nombre es requerido',
                    okButtonText: 'OK'
                });
                return false;
            }
            
            if (!this.formData.email.trim() || !this.formData.email.includes('@')) {
                dialogs.alert({
                    title: 'Error',
                    message: 'Ingrese un email válido',
                    okButtonText: 'OK'
                });
                return false;
            }
            
            return true;
        },
        
        async confirmDelete() {
            const confirm = await dialogs.confirm({
                title: 'Confirmar',
                message: `¿Eliminar usuario ${this.formData.name}?`,
                okButtonText: 'Sí',
                cancelButtonText: 'No'
            });
            
            if (confirm) {
                try {
                    const response = await fetch(`http://10.0.2.2:5140/api/User/${this.formData.id}`, {
                        method: 'DELETE'
                    });
                    
                    if (!response.ok) throw new Error('Error al eliminar');
                    
                    await dialogs.alert({
                        title: 'Éxito',
                        message: 'Usuario eliminado',
                        okButtonText: 'OK'
                    });
                    
                    this.$modal.close('refresh');
                } catch (error) {
                    await dialogs.alert({
                        title: 'Error',
                        message: error.message || 'Error al eliminar usuario',
                        okButtonText: 'OK'
                    });
                }
            }
        }
    }
};
</script>

<style scoped>
.modal-title {
    font-size: 20;
    font-weight: bold;
    alleys: 20;
    text-align: center;
}
.input-field {
    margin-bottom: 15;
    padding: 10;
    border-width: 1;
    border-color: #ccc;
    border-radius: 5;
}
.btn {
    padding: 10 15;
    border-radius: 5;
    margin: 0 5;
}
.btn-primary {
    background-color: #2196F3;
    color: white;
}
.btn-cancel {
    background-color: #f1f1f1;
    color: #333;
}
.btn-danger {
    background-color: #F44336;
    color: white;
}
</style>