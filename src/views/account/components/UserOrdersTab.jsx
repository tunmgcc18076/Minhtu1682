import React from "react";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { ImageLoader, MessageDisplay } from "@/components/common";
import iconArrowDown from "@/images/arrow-down.png";
import iconArrowRight from "@/images/arrow-right.png";
import moment from "moment/moment";

const UserOrdersTab = () => {
  const { profile, myOrders } = useSelector((state) => ({
    profile: state.profile,
    myOrders: state.myOrders.items,
  }));

  const [ListMyOrders, setListMyOrders] = useState([]);
  const [dateArray, setDateArray] = useState([]);

  useEffect(() => {
    if (myOrders.length > 0) {
      let dataFormat = myOrders;
      dataFormat.map((order) => {
        switch (order.Status) {
          case "0":
            order.Status = "Prepare For Delivery";
          case "1":
            order.Status = "Delivering";
          case "2":
            order.Status = "Successful Delivery";
          case "3":
            order.Status = "Delivery Failed";
          default:
            order.Status = "Prepare For Delivery";
        }
        order.Date = moment(order.OrderAt).format("DD MMM YYYY");
        order.Time = order.OrderAt.toLocaleTimeString();
      });

      let dateArrayNew = [
        {
          Date: "",
          Orders: [],
          isShow: false,
        },
      ];
      dataFormat.map((order, index) => {
        let listFilter = dateArrayNew.filter(
          (item) => item?.Date === order.Date
        );
        if (listFilter.length === 0 && dateArrayNew[0].Date === "") {
          dateArrayNew[0] = {
            Date: order.Date,
            Orders: [order],
            isShow: false,
          };
        } else if (listFilter.length === 0 && dateArrayNew[0].Date !== "") {
          dateArrayNew.push({
            Date: order.Date,
            Orders: [order],
            isShow: false,
          });
        } else {
          let index = listFilter.map((item, index) => {
            if (item?.Date === order.Date) {
              return index;
            }
          })[0];
          dateArrayNew[index].Orders.push(order);
        }
      });

      setListMyOrders(dateArrayNew);
    }
  }, []);

  const handleShowDetail = (index) => {
    let array = ListMyOrders;
    array[index].isShow = !array[index].isShow;

    setListMyOrders([...array]);
  };

  return (
    <div className="h-100 w-100" style={{ minHeight: "80vh" }}>
      {ListMyOrders &&
        ListMyOrders.map((item, index) => {
          return (
            <div className="w-100 h-100 margin-bottom-10" key={index}>
              <div
                style={{
                  width: "100%",
                  height: 45,
                  backgroundColor: "gray",
                  flexDirection: "row",
                  display: "flex",
                  border: "0.2px solid",
                  borderColor: "rgba(0,0,0,0.4)",
                }}
              >
                <div
                  style={{
                    width: "90%",
                    backgroundColor: "black",
                    height: "100%",
                    paddingLeft: 5,
                    userSelect: "none",
                  }}
                  onClick={() => handleShowDetail(index)}
                >
                  <span
                    className="text-name-order"
                    style={{ fontSize: 17, color: "white" }}
                  >
                    Orders on: {item.Date} <br />
                  </span>
                  <span
                    className="text-name-order"
                    style={{ fontSize: 14, color: "white" }}
                  >
                    Total: {item.Orders.length}
                  </span>
                </div>
                <div
                  style={{
                    width: "10%",
                    height: "100%",
                    backgroundColor: "yellow",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <button
                    style={{
                      width: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      borderWidth: 0,
                    }}
                    onClick={() => handleShowDetail(index)}
                    type="button"
                  >
                    <img
                      alt="ShowDetail"
                      src={item.isShow ? iconArrowDown : iconArrowRight}
                      style={{ width: 20, height: 20, alignSelf: "center" }}
                    />
                  </button>
                </div>
              </div>

              {item.isShow && item.Orders.length > 0 ? (
                <div
                  className="w-100"
                  style={{
                    backgroundColor: "white",
                    marginTop: 5,
                    transition: "all .2s",
                    border: "0.2px solid",
                    borderColor: "rgba(0,0,0,0.4)",
                    marginBottom: 5,
                  }}
                >
                  <table className="table-order" style={{ width: "100%" }}>
                    <tbody>
                      <tr className="table-order">
                        <th className="table-order">Time</th>
                        <th className="table-order">Status Shipping</th>
                        <th className="table-order">Delivery Address</th>
                        <th className="table-order">Products</th>
                        <th className="table-order">Order Total</th>
                      </tr>
                      {item.Orders.map((order, i) => {
                        return (
                          <tr className="table-order table-textfm">
                            {/* Col Time */}
                            <td className="table-order">{order.Time}</td>

                            {/* Col Status */}
                            <td className="table-order" 
                              style={{
                                border: '0',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'left',
                              }}
                            >
                              <span style={{fontSize: 16, color: 'rgba(0,0,0,.87)', margin: 0, padding: 0}}>{order.Status}</span>
                              <br/>
                              <br/>
                              <span style={{fontSize: 14, color: 'rgba(0,0,0,.54)', margin: 0, padding: 0}}>{order.Payment.toUpperCase()}</span>
                            </td>

                            {/* Col Contact */}
                            <td
                              className="table-order"
                              style={{ textAlign: "start" }}
                            >
                              <span style={{fontSize: 16, color: 'rgba(0,0,0,.87)', margin: 0, padding: 0}}>{order.Shipping.fullname}</span>
                              <br />
                              <br />
                              <span style={{fontSize: 16, color: 'rgba(0,0,0,.54)', margin: 0, padding: 0}}>
                                (+{order.Shipping.mobile.value.slice(0,2)}){" "+order.Shipping.mobile.value.slice(2, order.Shipping.mobile.value.length)}
                                <br />
                                {" "+order.Shipping.address + ", "+order.Shipping.mobile.country}
                              </span>
                            </td>

                            {/* Col Product */}
                            <td className="table-order td-pd">
                              {order.Products.map((product, index) => {
                                let stringProduct = (
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                      alignItems: 'center',
                                    }}
                                  >
                                    <img
                                      alt="pd-image-${index}"
                                      src={product.image}
                                      style={{
                                        width: 60,
                                        height: 65,
                                        alignSelf: "center",
                                        border: "1px solid rgb(44, 44, 44)",
                                        objectFit: "contain",
                                        marginRight: 10
                                      }}
                                    />
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: 'flex-start'
                                      }}
                                    >
                                      {index !== 0 ? "\n" : ""}
                                      <p
                                        style={{
                                          fontWeight: "bold",
                                          fontSize: 16,
                                          color: "rgba(0,0,0,.87)",
                                          margin: 0,
                                          padding: 0,
                                          overflow: 'hidden',
                                          textAlign: 'left',
                                          textOverflow: 'ellipsis',
                                          maxWidth: 350
                                        }}
                                      >
                                        {product.name}
                                      </p>
                                      
                                      <p
                                        style={{
                                          fontSize: 14,
                                          color: "rgba(0,0,0,.54)",
                                          whiteSpace: "break-spaces",
                                          margin: 0,
                                          padding: 0,
                                          overflow: 'hidden',
                                          textAlign: 'left',
                                          textOverflow: 'ellipsis',
                                          maxWidth: 300
                                        }}
                                      >Brand:
                                        {
                                          " "+product.brand
                                        }
                                      </p>
                                      <p
                                        style={{
                                          fontSize: 14,
                                          color: "rgba(0,0,0,.87)",
                                          whiteSpace: "break-spaces",
                                          margin: 0,
                                          padding: 0,
                                          overflow: 'hidden',
                                          textAlign: 'left',
                                          textOverflow: 'ellipsis',
                                          maxWidth: 100
                                        }}
                                      >
                                        X{product.quantity}
                                      </p>
                                    </div>
                                    <p
                                        style={{
                                          fontSize: 14,
                                          color: "rgba(0,0,0,.87)",
                                          whiteSpace: "break-spaces",
                                          margin: 0,
                                          padding: 0,
                                          marginLeft: 'auto',
                                          overflow: 'hidden',
                                          textAlign: 'left',
                                          textOverflow: 'ellipsis',
                                          maxWidth: 100
                                        }}
                                      >
                                        {
                                          product.price + "$"
                                        }
                                      </p>
                                  </div>
                                );
                                return stringProduct;
                              })}
                            </td>

                            {/* Col Total */}
                            <td className="table-order">{order.Total}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div />
              )}
            </div>
          );
        })}
    </div>
  );
};

export default UserOrdersTab;
