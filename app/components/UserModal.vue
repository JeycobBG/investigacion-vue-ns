<template>
    <GridLayout rows="auto, auto, auto" padding="20" backgroundColor="white">
        <TextField row="0" hint="Nombre" v-model="name" />
        <TextField row="1" hint="Email" v-model="email" keyboardType="email" />
        <StackLayout row="2" orientation="horizontal" horizontalAlignment="right" marginTop="20">
            <Button text="Cancelar" @tap="$emit('close', false)" />
            <Button :text="mode === 'edit' ? 'Actualizar' : 'Crear'" @tap="submit" />
            <Button
                v-if="mode === 'edit'"
                text="Eliminar"
                class="delete-button"
                @tap="confirmDelete"
                marginLeft="10"
            />
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
                dialogs.alert({ title: 'Error', message: 'Nombre y email son requeridos', okButtonText: 'OK' })
                return
            }
            try {
                const url =
                    this.mode === 'edit'
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

                dialogs.alert({
                    title: 'Éxito',
                    message: this.mode === 'edit' ? 'Usuario actualizado' : 'Usuario creado',
                    okButtonText: 'OK',
                })

                this.$emit('close', true)
            } catch (err) {
                dialogs.alert({ title: 'Error', message: err.message, okButtonText: 'OK' })
            }
        },
        async confirmDelete() {
            const result = await dialogs.confirm({
                title: 'Confirmar eliminación',
                message: `¿Eliminar usuario ${this.name}?`,
                okButtonText: 'Sí',
                cancelButtonText: 'No',
            });
            if (result) {
                this.$emit('delete', this.user.id);
            }
        },
    },
}
</script>