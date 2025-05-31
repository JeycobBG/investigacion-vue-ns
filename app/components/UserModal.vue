<template>
    <GridLayout rows="auto, auto, auto" padding="20" backgroundColor="white">
        <TextField row="0" hint="Nombre" v-model="name" />
        <TextField row="1" hint="Email" v-model="email" keyboardType="email" />
        <StackLayout row="2" orientation="horizontal" horizontalAlignment="right" marginTop="20">
            <Button text="Cancelar" @tap="close" class="cancel-btn" />
            <Button :text="saveButtonText" @tap="submit" class="save-btn" />
        </StackLayout>
    </GridLayout>
</template>

<script>
import * as dialogs from '@nativescript/core/ui/dialogs';

export default {
    props: {
        user: Object,
        mode: { type: String, default: 'create' }
    },
    data() {
        return {
            name: this.user?.name || '',
            email: this.user?.email || ''
        };
    },
    computed: {
        saveButtonText() {
            return this.mode === 'edit' ? 'Actualizar' : 'Crear';
        }
    },
    methods: {
        close() {
            this.$emit('close');
        },
        async submit() {
            if (!this.name.trim() || !this.email.trim()) {
                dialogs.alert('Nombre y email son requeridos');
                return;
            }

            try {
                const url = this.mode === 'edit' 
                    ? `http://10.0.2.2:5140/api/User/${this.user.id}`
                    : 'http://10.0.2.2:5140/api/User';
                
                const method = this.mode === 'edit' ? 'PUT' : 'POST';
                const body = JSON.stringify({ name: this.name, email: this.email });

                const res = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body
                });

                if (!res.ok) throw new Error('Error en la operación');

                dialogs.alert({
                    title: 'Éxito',
                    message: `Usuario ${this.mode === 'edit' ? 'actualizado' : 'creado'}`,
                    okButtonText: 'OK'
                });

                this.$emit('refreshUsers');
                this.close();
            } catch (err) {
                dialogs.alert({
                    title: 'Error',
                    message: 'Operación fallida',
                    okButtonText: 'OK'
                });
            }
        }
    }
};
</script>

<style scoped>
.cancel-btn {
    background-color: #f44336;
    color: white;
    margin-right: 10;
    border-radius: 5;
}
.save-btn {
    background-color: #4CAF50;
    color: white;
    border-radius: 5;
}
TextField {
    margin-bottom: 15;
    padding: 10;
    border-bottom-width: 1;
    border-color: #ccc;
}
</style>