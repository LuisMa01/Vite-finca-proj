import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetCropsQuery } from "./redux/cropApiSlice";

import "../../styles/nuevo-cultivo.css";

import { useGetDatesQuery } from "./redux/appApiSlice";
import { useGetComtsQuery } from "./redux/comtApiSlice";
import { useGetCostsQuery } from "./redux/costApiSlice";
import loyola70 from "../../images/loyola70.png";

import {
  Page,
  Image,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  PDFDownloadLink,
} from "@react-pdf/renderer";

// Create styles

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
    textAlign: "center",
    fontSize: 12,
  },
  flexcontainerCol: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",

    backgroundColor: "#E4E4E4",
  },
  flexcontainerHeadRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "center",
    textAlign: "center",
    backgroundColor: "#E4E4",
  },
  flexcontainerRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "stretch",
    textAlign: "center",
    backgroundColor: "#E455",
  },
  flexcontainerRowFoot: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "stretch",
    textAlign: "center",
    backgroundColor: "#E4213f",
  },
  items: {
    alignSelf: "auto",
    flexGrow: 1,
    width: 100,
  },
  itemsComt: {
    alignSelf: "auto",
    flexGrow: 5,
    width: 100,
  },
  itemsNum: {
    alignSelf: "auto",
    flexGrow: 1,
    width: 30,
  },
  image: {
    marginVertical: 1,
    marginHorizontal: 2,
  },
  imageItem: {
    width: 200,
  },
  headRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-between",
  },
  secInfoCol: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
  },
  secInfoRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-between",
    textAlign: "center",
  },
  secInfoItem: {
    alignSelf: "auto",
    flexGrow: 1,
    width: 100,
  },
});

const infoCultivoPdf = () => {
  const { id } = useParams();

  const { crop } = useGetCropsQuery("cropsList", {
    selectFromResult: ({ data }) => ({
      crop: data?.entities[id],
    }),
  });

  let cropUsado = 0;
  const { dates } = useGetDatesQuery("datesList", {
    selectFromResult: ({ data }) => ({
      dates: data?.ids?.map((Id) => {
        if (data?.entities[Id].date_crop_key == id) {
          cropUsado = cropUsado + 1;
          return data?.entities[Id];
        }
      }),
    }),
  });
  const { cost } = useGetCostsQuery("costsList", {
    selectFromResult: ({ data }) => ({
      cost: data?.ids?.map((Id) => {
        if (data?.entities[Id].date_crop_key == id) {
          return data?.entities[Id];
        }
      }),
    }),
  });
  const { comt } = useGetComtsQuery("comtsList", {
    selectFromResult: ({ data }) => ({
      comt: data?.ids?.map((ID) => {
        if (data?.entities[ID].date_crop_key == id) {
          return data?.entities[ID];
        }
      }),
    }),
  });

  //userRep, dateInit, dateEnd, actKey, cropKey, plantId , userRep, dateInit, dateEnd, actKey, cropKey, plantId

  let contenido;

  let dateList;

  let costList;
  let costTotal = [];
  let listSum = 0;
  let contenidoCost = <></>;
  let comtList;
  let listSumComt = 0;
  let contenidoComt = <></>;
  let numAct = 0;
  let generalInfo;
  if (crop) {
    //para asegurar que obtenga los datos del cultivo
    const fechaPlant =
      crop?.crop_plant == null
        ? "no asignado"
        : `${crop?.crop_plant}`.split("T")[0];

    const fechaHarvest =
      crop?.crop_harvest == null
        ? "no asignado"
        : `${crop?.crop_harvest}`.split("T")[0];
    generalInfo = (
      <View>
        <View></View>
        <View style={styles.secInfoCol}>
          <View style={styles.secInfoRow}>
            <View style={styles.secInfoItem}>
              <Text>Información general:</Text>
            </View>
          </View>
          <View style={styles.secInfoRow}>
            <View style={styles.secInfoItem}>
              <Text>Cultivo: </Text>
              <Text>{crop.crop_name}</Text>
            </View>
            <View style={styles.secInfoItem}>
              <Text>Planta:</Text>
              <Text>{crop?.plant_name}</Text>
            </View>
            <View style={styles.secInfoItem}>
              <Text>Variedad:</Text>
              <Text>{crop?.plant_variety}</Text>
            </View>
          </View>
          <View style={styles.secInfoRow}>
            <View style={styles.secInfoItem}>
              <Text>Marco de plantacion:</Text>
              <Text>{crop?.plant_frame}</Text>
            </View>
            <View style={styles.secInfoItem}>
              <Text>Campo:</Text>
              <Text>{crop?.camp_name}</Text>
            </View>
            <View style={styles.secInfoItem}>
              <Text>Área:</Text>
              <Text>{crop?.crop_area ? crop?.crop_area : 0} tareas</Text>
            </View>
          </View>

          <View style={styles.secInfoRow}>
            <View style={styles.secInfoItem}>
              <Text>Fecha de siembra:</Text>
              <Text>{fechaPlant}</Text>
            </View>
            <View style={styles.secInfoItem}>
              <Text>Fecha de cosecha:</Text>
              <Text>{fechaHarvest}</Text>
            </View>
            <View style={styles.secInfoItem}>
              <Text>
                Producto final:
                {crop.crop_final_prod}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );

    if (dates) {
      dateList =
        dates?.length &&
        dates.map((Id) => {
          if (Id?.date_crop_key == id) {
            const fechaIni =
              Id?.date_init == null
                ? "no asignado"
                : `${Id?.date_init}`.split("T")[0];

            const fechaFin =
              Id?.date_end == null
                ? "no asignado"
                : `${Id?.date_end}`.split("T")[0];
            numAct = numAct + 1;

            return (
              <>
                <View style={styles.flexcontainerRow}>
                  <View style={styles.itemsNum}>
                    <Text>{numAct}</Text>
                  </View>
                  <View style={styles.items}>
                    <Text>{Id?.act_name}</Text>
                  </View>
                  <View style={styles.items}>
                    <Text>{fechaIni}</Text>
                  </View>
                  <View style={styles.items}>
                    <Text>{fechaFin}</Text>
                  </View>
                </View>
              </>
            );
          }
        });
    }

    if (cost) {
      costList =
        cost?.length &&
        cost.map((Id) => {
          if (Id?.date_crop_key == id) {
            listSum = listSum + 1;
            let precioItem = new Intl.NumberFormat("es-do", {
              style: "currency",
              currency: "DOP",
            }).format(parseFloat(Id?.cost_item_price));

            let precio = new Intl.NumberFormat("es-do", {
              style: "currency",
              currency: "DOP",
            }).format(parseFloat(Id?.cost_price));
            let list = (
              <>
                <View style={styles.flexcontainerRow}>
                  <View style={styles.items}>
                    <Text>{Id?.item_name}</Text>
                  </View>
                  <View style={styles.items}>
                    <Text>{Id?.act_name}</Text>
                  </View>
                  <View style={styles.items}>
                    <Text>{Id?.dose_name}</Text>
                  </View>
                  <View style={styles.items}>
                    <Text>{Id?.cost_quantity}</Text>
                  </View>
                  <View style={styles.items}>
                    <Text>{Id?.dose_unit}</Text>
                  </View>
                  <View style={styles.items}>
                    <Text>{precioItem}</Text>
                  </View>
                  <View style={styles.items}>
                    <Text>{precio}</Text>
                  </View>
                </View>
              </>
            );
            costTotal.push(parseFloat(Id?.cost_price));
            return list;
          }
        });
      let TT = costTotal.reduce((valorAnterior, valorActual) => {
        return valorAnterior + valorActual;
      }, 0);
      let precioTT = new Intl.NumberFormat("es-do", {
        style: "currency",
        currency: "DOP",
      }).format(parseFloat(TT));

      if (listSum > 0) {
        contenidoCost = (
          <>
            <Page size="A4" style={styles.body}>
              <View>
                <Text>MATERIALES, INSUMOS Y MANO DE OBRA:</Text>
                <View style={styles.flexcontainerCol}>
                  <View style={styles.flexcontainerHeadRow}>
                    <View style={styles.items}>
                      <Text>Articulo</Text>
                    </View>
                    <View style={styles.items}>
                      <Text>Actividad</Text>
                    </View>
                    <View style={styles.items}>
                      <Text>Dosis</Text>
                    </View>
                    <View style={styles.items}>
                      <Text>Cantidad</Text>
                    </View>
                    <View style={styles.items}>
                      <Text>Unidad</Text>
                    </View>
                    <View style={styles.items}>
                      <Text>Precio</Text>
                    </View>
                    <View style={styles.items}>
                      <Text>Total</Text>
                    </View>
                  </View>
                  {costList}
                  <View style={styles.flexcontainerRowFoot}>
                    <View>
                      <Text>{precioTT}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </Page>
          </>
        );
      }
    }

    if (comt) {
      comtList =
        comt?.length &&
        comt.map((Id) => {
          if (Id?.date_crop_key == id) {
            listSumComt = listSumComt + 1;
            const fecha =
              Id?.comt_date == null ? "" : `${Id?.comt_date}`.split("T")[0];
            return (
              <>
                <View style={styles.flexcontainerRow}>
                  <View style={styles.items}>
                    <Text>{fecha}</Text>
                  </View>
                  <View style={styles.items}>
                    <Text>{Id?.act_name}</Text>
                  </View>
                  <View style={styles.itemsComt}>
                    <Text>{Id?.comt_desc}</Text>
                  </View>
                </View>
              </>
            );
          }
        });

      if (listSumComt > 0) {
        contenidoComt = (
          <>
            <Page size="A4" style={styles.body}>
              <View>
                <Text>Observaciones:</Text>
                <View style={styles.flexcontainerCol}>
                  <View style={styles.flexcontainerHeadRow}>
                    <View style={styles.items}>
                      <Text>Fecha</Text>
                    </View>
                    <View style={styles.items}>
                      <Text>Actividad</Text>
                    </View>
                    <View style={styles.itemsComt}>
                      <Text>Comentario</Text>
                    </View>
                  </View>
                  {comtList}
                </View>
              </View>
            </Page>
          </>
        );
      }
    }

    /*
    if (dateIsError) {
      dateList = <Text>{dateError?.data?.message}</Text>;
    }
   */
    contenido = (
      <PDFViewer style={{ width: "100%", height: "90vh" }}>
        <Document>
          <Page size="A4" style={styles.body}>
            <View style={styles.headRow}>
              <View style={styles.imageItem}>
                <Image style={styles.image} src={loyola70} />
              </View>
              <View>
                <Text>Finca Experimental</Text>
                <Text>Profesor André Vloebergh</Text>
              </View>
            </View>
            <View>{generalInfo}</View>
            <View>
              <Text>LABORES DEL CULTIVO</Text>
              <View style={styles.flexcontainerCol}>
                <View style={styles.flexcontainerHeadRow}>
                  <View style={styles.itemsNum}>
                    <Text>#</Text>
                  </View>
                  <View style={styles.items}>
                    <Text>Actividad</Text>
                  </View>
                  <View style={styles.items}>
                    <Text>Fecha Programada</Text>
                  </View>
                  <View style={styles.items}>
                    <Text>Fecha Ejecutada</Text>
                  </View>
                </View>

                {dateList}
              </View>
            </View>
          </Page>
          {contenidoCost}
          {contenidoComt}
        </Document>
      </PDFViewer>
    );
  } else {
    contenido = (
      <PDFViewer>
        <Document>
          <Page>
            <View>
              <Text>no disponible</Text>
            </View>
          </Page>
        </Document>
      </PDFViewer>
    );
  }

  return contenido;
};

export default infoCultivoPdf;
