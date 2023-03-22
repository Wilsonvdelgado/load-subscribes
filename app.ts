// import { env } from "process";

// import { PrismaClient } from "@prisma/client";
const { PrismaClient } = require("@prisma/client");
const readXlsxFile = require("read-excel-file/node");

const prisma = new PrismaClient();

async function main() {
  const rows = await readXlsxFile(__dirname + process.env.FILE_URL);

  try {
    await prisma.$transaction(async (tx) => {
      for (let index = 0; index < rows.length; index++) {
        const row = rows[index];
        if (index == 0) {
          continue;
        }

        const count = await tx.inscritos.count();
        if (index <= count) {
          console.warn("Não foi inserido  " + row[3] + " nº" + index);
          continue;
        }

        const data_inscricao = row[0];
        const email = row[1];
        const pontuacao = row[2];
        const nome = row[3];
        const sexo = row[4];
        const data_nascimento = row[5];

        const pais_residencia = row[6];
        const diocese = row[7];
        const paroquia = row[8];
        const ilha = row[9];
        const responsabilidade_pastoral = row[10];
        const escolaridade = row[11];
        const profissao = row[12]?.toString();
        const telemovel = row[13]?.toString();
        const pertence_a_grupo_religioso = row[14];
        const ja_participou_na_jornada = row[15];
        const tem_necessidade_especial = row[16];
        const precisa_visto_portugal = row[17];
        const anexo = row[18];
        const grupo = row[19];
        const pais_ano_participacao_jmj = row[20];
        const necessidade_especial = row[21];
        const nome_rede_social = row[22];
        const dataAtual = new Date();

        console.log("inserindo " + index + "º " + "inscrito: " + nome);

        const subscribe = await tx.inscritos.create({
          data: {
            nome: nome.trim(),
            anexo: anexo.trim(),
            data_inscricao: new Date(data_inscricao),
            data_nascimento: new Date(data_nascimento),
            diocese: diocese?.trim(),
            email: email?.trim() ?? "",
            escolaridade: escolaridade?.trim() ?? "",
            ilha: ilha.trim(),
            ja_participou_na_jornada: ja_participou_na_jornada.trim(),
            pais_residencia: pais_residencia.trim(),
            paroquia: paroquia.trim(),
            pertence_a_grupo_religioso: pertence_a_grupo_religioso.trim(),
            precisa_visto_portugal: precisa_visto_portugal,
            profissao: profissao?.trim() ?? "",
            responsabilidade_pastoral: responsabilidade_pastoral.trim(),
            sexo: sexo.trim(),
            telemovel: telemovel.trim(),
            tem_necessidade_especial: tem_necessidade_especial.trim(),
            created_at: dataAtual,
            updated_at: dataAtual,
            pais_ano_participacao_jmj: pais_ano_participacao_jmj,
            necessidade_especial: necessidade_especial,
            nome_rede_social: nome_rede_social,
            estado: "EM_ANALISE",
            grupo: grupo,
            inscricao_historico: {
              create: [
                {
                  data: dataAtual,
                  tipo: "INSCRICAO",
                  titulo: "Inscrição",
                  descricao: "Inscrição",
                },
              ],
            },
          },
        });
      }
    });
  } catch (error) {
    console.log("error");
    console.log(error);
  }
}

main();
