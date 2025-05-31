<template>
    <GridLayout rows="auto, auto, auto" padding="20" backgroundColor="white">
        <TextField row="0" hint="Nombre" v-model="name" />
        <TextField row="1" hint="Email" v-model="email" keyboardType="email" />
        <StackLayout row="2" orientation="horizontal" horizontalAlignment="right" marginTop="20">
            <Button text="Cancelar" @tap="$emit('close', false)" />
            <Button :text="mode === 'edit' ? 'Actualizar' : 'Crear'" @tap="submit" />
            <Button v-if="mode === 'edit'" text="Eliminar" class="delete-button" @tap="confirmDelete" marginLeft="10" />
        </StackLayout>
    </GridLayout>
</template>

<script>
import * as dialogs from '@nativescript/core/ui/dialogs'

export default {
    props: {
        user: Object,
        mode: { type: String, default: 'create' },
    },
    data() {
        return {
            name: this.user ? this.user.name : '',
            email: this.user ? this.user.email : '',
        }
    },
    methods: {
        async submit() {
            if (!this.name || !this.email) {
                await dialogs.alert({ 
                    title: 'Error', 
                    message: 'Nombre y email son requeridos', 
                    okButtonText: 'OK' 
                })
                return
            }
            
            try {
                const url = this.mode === 'edit'
                    ? `http://10.0.2.2:5140/api/User/${this.user.id}`
                    : 'http://10.0.2.2:5140/api/User'
                const method = this.mode === 'edit' ? 'PUT' : 'POST'

                const body = {
                    name: this.name,
                    email: this.email
                }

                const res = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                })

                if (!res.ok) {
                    const error = await res.json()
                    throw new Error(error.message || 'Error en la petición')
                }

                // Mostrar mensaje de éxito
                await dialogs.alert({
                    title: 'Éxito',
                    message: this.mode === 'edit' ? 'Usuario actualizado correctamente' : 'Usuario creado correctamente',
                    okButtonText: 'OK',
                })
                
                // Emitir evento de cierre con éxito (sin setTimeout)
                this.$emit('close', true);
                
            } catch (err) {
                console.error('Error en submit:', err);
                await dialogs.alert({ 
                    title: 'Error', 
                    message: err.message || 'Error desconocido', 
                    okButtonText: 'OK' 
                })
            }
        },
        
        async confirmDelete() {
            try {
                const result = await dialogs.confirm({
                    title: 'Confirmar eliminación',
                    message: `¿Estás seguro de que quieres eliminar al usuario "${this.name}"?`,
                    okButtonText: 'Sí, eliminar',
                    cancelButtonText: 'Cancelar',
                });
                
                if (result) {
                    this.$emit('delete', this.user.id);
                }
            } catch (err) {
                console.error('Error en confirmDelete:', err);
            }
        },
    },
}
</script>

<style scoped>
.delete-button {
    background-color: #F44336;
    color: white;
}
</style>