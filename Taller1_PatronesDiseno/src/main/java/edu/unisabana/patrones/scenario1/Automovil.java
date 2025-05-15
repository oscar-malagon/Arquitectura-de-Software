package edu.unisabana.patrones.scenario1;

public class Automovil {

    private final String tipoMotor;
    private final String color;
    private final int numeroLlantas;
    private final String sistemaDeSonido;
    private final String interiores;
    private final boolean techoSolar;
    private final boolean navegacionGps;

    private Automovil(String tipoMotor,
                      String color,
                      int numeroLlantas,
                      String sistemaDeSonido,
                      String interiores,
                      boolean techoSolar,
                      boolean navegacionGps) {
        this.tipoMotor = tipoMotor;
        this.color = color;
        this.numeroLlantas = numeroLlantas;
        this.sistemaDeSonido = sistemaDeSonido;
        this.interiores = interiores;
        this.techoSolar = techoSolar;
        this.navegacionGps = navegacionGps;
    }

    public String getTipoMotor() {
        return tipoMotor;
    }

    public String getColor() {
        return color;
    }

    public int getNumeroLlantas() {
        return numeroLlantas;
    }

    public String getSistemaDeSonido() {
        return sistemaDeSonido;
    }

    public String getInteriores() {
        return interiores;
    }

    public boolean isTechoSolar() {
        return techoSolar;
    }

    public boolean isNavegacionGps() {
        return navegacionGps;
    }

    @Override
    public String toString() {
        return "🚙 Automovil{" +
                " 💨 tipoMotor='" + tipoMotor + '\'' +
                ", 🌈color='" + color + '\'' +
                ", 🛞 numeroLlantas=" + numeroLlantas +
                ", 🔉 sistemaDeSonido='" + sistemaDeSonido + '\'' +
                ", 🪑 interiores='" + interiores + '\'' +
                ", 🌤️ techoSolar=" + (techoSolar ? "si": "no")  +
                ", 🗺️ navegacionGps=" + (navegacionGps ? "si": "no") +
                '}';
    }

    public static class Builder {
        private String tipoMotor;
        private String color;
        private int numeroLlantas;
        private String sistemaDeSonido;
        private String interiores;
        private boolean techoSolar;
        private boolean navegacionGps;

        public static Builder toBuilder(Automovil automovil) {
            Builder builder = new Builder();
            builder.tipoMotor(automovil.tipoMotor);
            builder.color(automovil.color);
            builder.numeroLlantas(automovil.numeroLlantas);
            builder.sistemaDeSonido(automovil.sistemaDeSonido);
            builder.interiores(automovil.interiores);
            builder.techoSolar(automovil.techoSolar);
            builder.navegacionGps(automovil.navegacionGps);

            return builder;
        }

        public Builder tipoMotor(String tipoMotor) {
            this.tipoMotor = tipoMotor;
            return this;
        }

        public Builder color(String color) {
            this.color = color;
            return this;
        }

        public Builder numeroLlantas(int numeroLlantas) {
            this.numeroLlantas = numeroLlantas;
            return this;
        }

        public Builder sistemaDeSonido(String sistemaDeSonido) {
            this.sistemaDeSonido = sistemaDeSonido;
            return this;
        }

        public Builder interiores(String interiores) {
            this.interiores = interiores;
            return this;
        }

        public Builder techoSolar(boolean techoSolar) {
            this.techoSolar = techoSolar;
            return this;
        }

        public Builder navegacionGps(boolean navegacionGps) {
            this.navegacionGps = navegacionGps;
            return this;
        }

        public Automovil build() {
            // Validacion para demostrar que el build puede garantizar el estado de algunos campos
            if (this.tipoMotor == null) {
                throw new IllegalStateException("Tipo motor debe ser especificado");
            }

            return new Automovil(
                    this.tipoMotor,
                    this.color,
                    this.numeroLlantas,
                    this.sistemaDeSonido,
                    this.interiores,
                    this.techoSolar,
                    this.navegacionGps
            );
        }

    }
}
