(function () {
    function obterIdentidadeUsuario() {
        var id = sessionStorage.getItem("ID_USUARIO");
        var email = sessionStorage.getItem("EMAIL_USUARIO");

        if (email) return "email:" + email.trim().toLowerCase();
        if (id) return "id:" + id;
        return "visitante";
    }

    function obterChavePerfil() {
        var identidade = obterIdentidadeUsuario();
        return identidade ? "syskage:perfil-ninja:" + identidade : null;
    }

    function lerPerfil() {
        var chave = obterChavePerfil();
        if (!chave) return null;

        try {
            return JSON.parse(localStorage.getItem(chave) || "null");
        } catch (erro) {
            return null;
        }
    }

    function inicializarPaginaPerfilNinja() {
        var formulario = document.getElementById("form-perfil-ninja");
        if (!formulario) return;

        var perfil = lerPerfil();
        var titulo = document.getElementById("titulo-perfil");
        var botao = document.getElementById("botao-salvar-perfil");
        var feedback = document.getElementById("feedback-perfil");
        var erroChakra = document.getElementById("erro-chakra");

        if (perfil) {
            titulo.textContent = "Editar perfil ninja";
            botao.textContent = "Salvar alterações";
            formulario.elements.aldeia.value = perfil.aldeia || "";
            formulario.elements.cla.value = perfil.cla || "";
            formulario.elements.especialidade.value = perfil.especialidade || "";
            formulario.elements.personagemFavorito.value = perfil.personagemFavorito || "";
            formulario.elements.kekkeiGenkai.value = perfil.kekkeiGenkai || "";

            Array.prototype.forEach.call(formulario.querySelectorAll('input[name="naturezaChakra"]'), function (opcao) {
                opcao.checked = (perfil.naturezaChakra || []).indexOf(opcao.value) !== -1;
            });
        }

        formulario.addEventListener("submit", function (evento) {
            evento.preventDefault();
            feedback.textContent = "";
            feedback.classList.remove("erro");
            erroChakra.textContent = "";

            if (!formulario.reportValidity()) return;

            var naturezas = Array.prototype.map.call(
                formulario.querySelectorAll('input[name="naturezaChakra"]:checked'),
                function (opcao) { return opcao.value; }
            );

            if (naturezas.length === 0) {
                erroChakra.textContent = "Selecione ao menos uma natureza de chakra.";
                formulario.querySelector('input[name="naturezaChakra"]').focus();
                return;
            }

            var dadosPerfil = {
                aldeia: formulario.elements.aldeia.value,
                cla: formulario.elements.cla.value,
                naturezaChakra: naturezas,
                especialidade: formulario.elements.especialidade.value,
                personagemFavorito: formulario.elements.personagemFavorito.value,
                kekkeiGenkai: formulario.elements.kekkeiGenkai.value
            };

            try {
                localStorage.setItem(obterChavePerfil(), JSON.stringify(dadosPerfil));
                titulo.textContent = "Editar perfil ninja";
                botao.textContent = "Salvar alterações";
                feedback.textContent = "Perfil ninja salvo neste navegador.";
            } catch (erro) {
                feedback.classList.add("erro");
                feedback.textContent = "Não foi possível salvar o perfil neste navegador.";
            }
        });
    }

    function inicializarDashboard() {
        var nomeUsuario = document.getElementById("b_usuario");
        if (nomeUsuario && sessionStorage.getItem("NOME_USUARIO")) {
            nomeUsuario.textContent = sessionStorage.getItem("NOME_USUARIO");
        }

        var aviso = document.getElementById("aviso-perfil-ninja");
        if (aviso) aviso.hidden = Boolean(lerPerfil());
    }

    window.SysKagePerfilNinja = {
        inicializarPagina: inicializarPaginaPerfilNinja,
        inicializarDashboard: inicializarDashboard
    };
})();
