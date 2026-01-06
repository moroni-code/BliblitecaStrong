import { GENESIS_DATA } from './genesisData';
import { EXODO_DATA } from './exodoData';
import { LEVITICO_DATA } from './leviticoData';
import { NUMEROS_DATA } from './numerosData';
import { DEUTERONOMIO_DATA } from './deuteronomioData';
import { JOSUE_DATA } from './josueData';
import { JUECES_DATA } from './juecesData';
import { RUT_DATA } from './rutData';
import { UNA_SAMUEL_DATA } from './1samuelData';
import { DOS_SAMUEL_DATA } from './2samuelData';
import { UNA_REYES_DATA } from './1reyesData';
import { DOS_REYES_DATA } from './2reyesData';
import { DOS_CRONICAS_DATA } from './2cronicasData';
import { ESDRAS_DATA } from './esdrasData';
import { NEHEMIAS_DATA } from './nehemiasData';
import { ESTER_DATA } from './esterData';
import { JOB_DATA } from './jobData';
import { SALMOS_DATA } from './salmosData';
import { PROVERBIOS_DATA } from './proverbiosData';
import { ECLESIASTES_DATA } from './eclesiastesData';
import { CANTARES_DATA } from './cantaresData';
import { ISAIAS_DATA } from './isaiasData';
import { JEREMIAS_DATA } from './jeremiasData';
import { LAMENTACIONES_DATA } from './lamentacionesData';
import { EZEQUIEL_DATA } from './ezequielData';
import { DANIEL_DATA } from './danielData';
import { OSEAS_DATA } from './oseasData';
import { JOEL_DATA } from './joelData';
import { AMOS_DATA } from './amosData';
import { ABDIAS_DATA } from './abdiasData';
import { JONAS_DATA } from './jonasData';
import { MIQUEAS_DATA } from './miqueasData';
import { NAHUM_DATA } from './nahumData';
import { HABACUC_DATA } from './habacucData';
import { SOFONIAS_DATA } from './sofoniasData';
import { HAGEO_DATA } from './hageoData';
import { ZACARIAS_DATA } from './zacariasData';
import { MALAQUIAS_DATA } from './malaquiasData';
import { MATEO_DATA } from './mateoData';
import { MARCOS_DATA } from './marcosData';
import { LUCAS_DATA } from './lucasData';
import { JUAN_DATA } from './juanData';
import { HECHOS_DATA } from './hechosData';
import { ROMANOS_DATA } from './romanosData';
import { DOS_CORINTIOS_DATA } from './2corintiosData';
import { GALATAS_DATA } from './galatasData';
import { EFESIOS_DATA } from './efesiosData';
import { FILIPENSES_DATA } from './filipensesData';
import { COLOSENSES_DATA } from './colosensesData';
import { UNA_TESALONICENSES_DATA } from './1tesalonicensesData';
import { DOS_TESALONICENSES_DATA } from './2tesalonicensesData';
import { UNA_TIMOTEO_DATA } from './1timoteoData';
import { DOS_TIMOTEO_DATA } from './2timoteoData';
import { TITO_DATA } from './titoData';
import { FILEMON_DATA } from './filemonData';
import { HEBREOS_DATA } from './hebreosData';
import { SANTIAGO_DATA } from './santiagoData';
import { UNA_PEDRO_DATA } from './1pedroData';
import { DOS_PEDRO_DATA } from './2pedroData';
import { UNA_JUAN_DATA } from './1juanData';
import { DOS_JUAN_DATA } from './2juanData';
import { TRES_JUAN_DATA } from './3juanData';
import { JUDAS_DATA } from './judasData';
import { APOCALIPSIS_DATA } from './apocalipsisData';

export const BIBLE_DATA: Record<string, (string[] | undefined)[]> = {
  'Génesis': GENESIS_DATA,
  'Éxodo': EXODO_DATA,
  'Levítico': LEVITICO_DATA,
  'Números': NUMEROS_DATA,
  'Deuteronomio': DEUTERONOMIO_DATA,
  'Josué': JOSUE_DATA,
  'Jueces': JUECES_DATA,
  'Rut': RUT_DATA,
  '1 Samuel': UNA_SAMUEL_DATA,
  '2 Samuel': DOS_SAMUEL_DATA,
  '1 Reyes': UNA_REYES_DATA,
  '2 Reyes': DOS_REYES_DATA,
  '1 Crónicas': [],
  '2 Crónicas': DOS_CRONICAS_DATA,
  'Esdras': ESDRAS_DATA,
  'Nehemias': NEHEMIAS_DATA,
  'Ester': ESTER_DATA,
  'Job': JOB_DATA,
  'Salmos': SALMOS_DATA,
  'Proverbios': PROVERBIOS_DATA,
  'Eclesiastés': ECLESIASTES_DATA,
  'Cantares': CANTARES_DATA,
  'Isaías': ISAIAS_DATA,
  'Jeremías': JEREMIAS_DATA,
  'Lamentaciones': LAMENTACIONES_DATA,
  'Ezequiel': EZEQUIEL_DATA,
  'Daniel': DANIEL_DATA,
  'Oseas': OSEAS_DATA,
  'Joel': JOEL_DATA,
  'Amós': AMOS_DATA,
  'Abdías': ABDIAS_DATA,
  'Jonás': JONAS_DATA,
  'Miqueas': MIQUEAS_DATA,
  'Nahúm': NAHUM_DATA,
  'Habacuc': HABACUC_DATA,
  'Sofonías': SOFONIAS_DATA,
  'Hageo': HAGEO_DATA,
  'Zacarías': ZACARIAS_DATA,
  'Malaquías': MALAQUIAS_DATA,
  'Mateo': MATEO_DATA,
  'Marcos': MARCOS_DATA,
  'Lucas': LUCAS_DATA,
  'Juan': JUAN_DATA,
  'Hechos': HECHOS_DATA,
  'Romanos': ROMANOS_DATA,
  '1 Corintios': [],
  '2 Corintios': DOS_CORINTIOS_DATA,
  'Gálatas': GALATAS_DATA,
  'Efesios': EFESIOS_DATA,
  'Filipenses': FILIPENSES_DATA,
  'Colosenses': COLOSENSES_DATA,
  '1 Tesalonicenses': UNA_TESALONICENSES_DATA,
  '2 Tesalonicenses': DOS_TESALONICENSES_DATA,
  '1 Timoteo': UNA_TIMOTEO_DATA,
  '2 Timoteo': DOS_TIMOTEO_DATA,
  'Tito': TITO_DATA,
  'Filemón': FILEMON_DATA,
  'Hebreos': HEBREOS_DATA,
  'Santiago': SANTIAGO_DATA,
  '1 Pedro': UNA_PEDRO_DATA,
  '2 Pedro': DOS_PEDRO_DATA,
  '1 Juan': UNA_JUAN_DATA,
  '2 Juan': DOS_JUAN_DATA,
  '3 Juan': TRES_JUAN_DATA,
  'Judas': JUDAS_DATA,
  'Apocalipsis': APOCALIPSIS_DATA
};