import "./App.css";
import { getData } from "./service";
import React, { useEffect, useState } from "react";
import { Accordion, Badge, Card, ListGroup, Pagination } from "react-bootstrap";
import {
  FacebookFilled,
  GlobalOutlined,
  InstagramFilled,
  LinkedinFilled,
  MailOutlined,
  PhoneOutlined,
  PushpinOutlined,
  SearchOutlined,
  TwitterSquareFilled,
  YoutubeFilled,
} from "@ant-design/icons";
import { debounce } from "lodash";
import FilterCenter from "./FilterCenter";

function App() {
  const [industries, setIndustries] = useState([]);
  const [countries, setCountries] = useState([]);
  const [exhibitors, setExhibitors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [countPage, setCountPage] = useState(0);
  const [selectedPage, setSelectedPage] = useState(null);
  const [filter, setFilter] = useState({
    industry_category: [],
    country: [],
    _fields:
      "id,title,content,exhibitor_name,logo,is_premium,banner_logo,description,country,industry_category,stand,fb_url,ig_url,twitter_url,yt_url,ig_url,linkedln_url,company_url,company_email,company_phone,address,gallery_image_1,gallery_image_2,gallery_title_1,gallery_title_2",
    search: "",
    search_first: "",
    order: "asc",
    orderby: "is_premium",
    page: 1,
    per_page: 5,
  });
  const loadIndustryCategories = () => {
    getData("industry_category", {
      _fields: "id,name,slug,count",
      per_page: 100,
      order: "desc",
      orderby: "id",
    }).then((res) => {
      setIndustries(res.data ?? []);
    });
  };

  const loadCountries = () => {
    getData("country", {
      _fields: "id,name,slug,count",
      per_page: 100,
      order: "desc",
      orderby: "id",
    }).then((res) => {
      setCountries(res.data ?? []);
    });
  };

  const loadExhibitors = () => {
    setLoading(true);
    getData("ciptadusa_directory", {
      ...filter,
      industry_category:
        filter.industry_category.length > 0
          ? filter.industry_category.join(",")
          : null,
      country: filter.country.length > 0 ? filter.country.join(",") : null,
    })
      .then((res) => {
        setExhibitors(res.data ?? []);
        setCount(res.headers["x-wp-total"] ?? 0);
        setCountPage(res.headers["x-wp-totalpages"] ?? 0);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handlePagination = (page) => {
    setFilter({
      ...filter,
      page,
    });
  };

  const next = () => {
    setFilter({
      ...filter,
      page: filter.page + 1,
    });
  };

  const prev = () => {
    setFilter({
      ...filter,
      page: filter.page - 1,
    });
  };

  const first = () => {
    setFilter({
      ...filter,
      page: 1,
    });
  };

  const last = () => {
    setFilter({
      ...filter,
      page: countPage,
    });
  };

  const handleFilterIndustry = (e, id) => {
    const isOn = e.target.checked;
    const newFilter = { ...filter };
    if (isOn) {
      newFilter.industry_category.push(id);
    } else {
      newFilter.industry_category = newFilter.industry_category.filter(
        (item) => item !== id
      );
    }
    setFilter(newFilter);
  };
  const handleFilterCountry = (e, id) => {
    const isOn = e.target.checked;
    const newFilter = { ...filter };
    if (isOn) {
      newFilter.country.push(id);
    } else {
      newFilter.country = newFilter.country.filter((item) => item !== id);
    }
    setFilter(newFilter);
  };

  const unescapeHtml = (unsafe) => {
    if (unsafe) {
      return new DOMParser().parseFromString(unsafe, "text/html")
        .documentElement.textContent;
    }
    return "";
  };
  const removeHtmlTags = (str) => {
    if (str === null || str === "") return false;
    else str = str.toString();
    return str.replace(/<[^>]*>/g, "");
  };

  const limitText = (text, limit) => {
    if (text) {
      const newText = text.split(" ").splice(0, limit).join(" ");
      return newText;
    }
    return "";
  };

  const removeIndustryFilter = (id) => {
    const newFilter = { ...filter };
    newFilter.industry_category = newFilter.industry_category.filter(
      (item) => item !== id
    );
    setFilter(newFilter);
  };

  const removeCountryFilter = (id) => {
    const newFilter = { ...filter };
    newFilter.country = newFilter.country.filter((item) => item !== id);
    setFilter(newFilter);
  };

  const handleSearchWithDebounce = (e) => {
    const newFilter = { ...filter };
    newFilter.search = e.target.value === "" ? null : e.target.value;
    setFilter(newFilter);
  };

  const GeneratePagination = () => {
    const items = [];
    for (let number = 1; number <= countPage; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === filter.page}
          onClick={() => handlePagination(number)}
        >
          {number}
        </Pagination.Item>
      );
    }
    return items;
  };

  const detailExhibitor = (item) => {
    setSelectedPage(item);
  };

  const openLink = (url) => {
    window.open(url, "_blank");
  };

  const backToExhibitor = () => {
    setSelectedPage(null);
  };

  const handleSearchFirst = (e) => {
    const newFilter = {
      ...filter,
      page: 1,
      search_first: e === "All" ? null : e,
    };
    setFilter(newFilter);
  };

  useEffect(() => {
    loadIndustryCategories();
    loadCountries();
  }, []);

  useEffect(() => {
    loadExhibitors();
  }, [filter]);

  return (
    <div className="directory-container">
      {selectedPage === null ? (
        <div className="row p-5" id="exhibitor-container">
          <div className="col-12">
            <div className="row">
              <div className="col-md-4 col-12">
                <div className="card empty-radius">
                  <div className="card-header empty-radius">
                    <span className="fw-bold">Filter</span>
                  </div>
                  <div className="card-body empty-radius">
                    <Accordion defaultActiveKey="0">
                      <Card>
                        <Accordion.Toggle
                          as={Card.Header}
                          className="fw-bold"
                          eventKey="0"
                        >
                          Industry Category
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                          <Card.Body>
                            {industries.map((item) => (
                              <div className="form-check" key={item.id}>
                                <input
                                  className="m-2"
                                  type="checkbox"
                                  checked={filter.industry_category.includes(
                                    item.id
                                  )}
                                  onChange={(e) =>
                                    handleFilterIndustry(e, item.id)
                                  }
                                  id={`industry-${item.id}`}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor={`industry-${item.id}`}
                                >
                                  {item.name}{" "}
                                  <span className="text-gray">
                                    ({item.count})
                                  </span>
                                </label>
                              </div>
                            ))}
                          </Card.Body>
                        </Accordion.Collapse>
                      </Card>
                      <Card>
                        <Accordion.Toggle
                          as={Card.Header}
                          className="fw-bold"
                          eventKey="1"
                        >
                          Country / Region
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="1">
                          <Card.Body>
                            {countries.map((item) => (
                              <div className="form-check" key={item.id}>
                                <input
                                  className="m-2"
                                  type="checkbox"
                                  checked={filter.country.includes(item.id)}
                                  onChange={(e) =>
                                    handleFilterCountry(e, item.id)
                                  }
                                  id={`country-${item.id}`}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor={`country-${item.id}`}
                                >
                                  {item.name}{" "}
                                  <span className="text-gray">
                                    ({item.count})
                                  </span>
                                </label>
                              </div>
                            ))}
                          </Card.Body>
                        </Accordion.Collapse>
                      </Card>
                    </Accordion>
                  </div>
                </div>
              </div>
              <div className="col-md-8 col-12">
                <div className="row m-md-0 m-2">
                  <div className="col-12 mb-2">
                    <div className="row">
                      <div className="col-12 col-md-9">
                        <input
                          type="text"
                          onChange={debounce(handleSearchWithDebounce, 500)}
                          className="form-control"
                          id="inputGroupFile04"
                        />
                      </div>
                      <div className="col-12 col-md-3">
                        <button
                          className="btn btn-block btn-outline-secondary no-radius"
                          type="button"
                        >
                          <SearchOutlined />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 mb-2">
                    {filter.industry_category &&
                      filter.industry_category.map((id, key) => (
                        <Badge
                          bg="secondary"
                          onClick={() => removeIndustryFilter(id)}
                          className="m-2"
                          style={{ cursor: "pointer" }}
                          key={key}
                        >
                          <span aria-hidden="true" className="m-2">
                            &times;
                          </span>
                          {industries.find((item) => item.id === id)?.name}
                        </Badge>
                      ))}
                    {filter.country &&
                      filter.country.map((id, key) => (
                        <Badge
                          bg="secondary"
                          style={{ cursor: "pointer" }}
                          key={key}
                          onClick={() => removeCountryFilter(id)}
                          className="m-2"
                        >
                          <span aria-hidden="true" className="m-2">
                            &times;
                          </span>
                          {countries.find((item) => item.id === id)?.name}
                        </Badge>
                      ))}
                  </div>
                  <div className="col-md-3 col-12 mb-2 mt-1 text-left">
                    <span>Showing {count} results</span>
                  </div>
                  <div className="col-md-7 col-12 mb-2 mt-1 text-center">
                    <FilterCenter
                      value={
                        filter.search_first === "" ? "All" : filter.search_first
                      }
                      onChange={handleSearchFirst}
                    />
                  </div>
                  <div className="col-md-2 col-12 mb-2 ">
                    {countPage > 1 && (
                      <Pagination className="float-right">
                        <Pagination.First
                          className="mr-2"
                          disabled={filter.page === 1}
                          onClick={first}
                        />
                        <Pagination.Prev
                          className="mr-2"
                          disabled={filter.page === 1}
                          onClick={prev}
                        />
                        <Pagination.Next
                          className="mr-2"
                          disabled={filter.page == countPage}
                          onClick={next}
                        />
                        <Pagination.Last
                          className="mr-2"
                          disabled={filter.page == countPage}
                          onClick={last}
                        />
                      </Pagination>
                    )}
                  </div>
                  {loading ? (
                    <div className="col-12 text-center mb-2">Loading ....</div>
                  ) : (
                    <>
                      {exhibitors &&
                        exhibitors.length > 0 &&
                        exhibitors.map((item, key) => (
                          <div className="col-12 mb-2" key={key}>
                            <div
                              className={`card empty-radius ${
                                item?.is_premium == 1 ? "premium-wrapper" : ""
                              }`}
                            >
                              {item?.is_premium == 1 && (
                                <div
                                  className={`card-header empty-radius premium-wrapper-background`}
                                >
                                  MAJOR EXHIBITOR
                                </div>
                              )}
                              <div
                                className={`card-body empty-radius ${
                                  item?.is_premium == 1
                                    ? "premium-background"
                                    : ""
                                }`}
                              >
                                <div className="row">
                                  <div className="col-md-2 col-4">
                                    <img
                                      src={item?.logo}
                                      className="img-thumbnail"
                                      alt=""
                                    />
                                  </div>
                                  <div className="col-md-6 col-8">
                                    <div className="row">
                                      <div
                                        className="col-12"
                                        style={{
                                          cursor: "pointer",
                                        }}
                                        onClick={() => detailExhibitor(item)}
                                      >
                                        <span className="fs-4 text-black fw-bold">
                                          {item?.exhibitor_name}
                                        </span>
                                      </div>
                                      <div className="col-12">
                                        <span className="fst-italic label-text m-2">
                                          Exhibitor of{" "}
                                        </span>
                                        <Badge bg="secondary">
                                          {
                                            industries.find(
                                              (e) =>
                                                e.id ==
                                                item?.industry_category[0]
                                            )?.name
                                          }
                                        </Badge>
                                      </div>
                                      <div className="col-12 mb-2">
                                        <span className="fst-italic label-text m-2">
                                          {countries
                                            .filter((e) =>
                                              item?.country.includes(e.id)
                                            )
                                            .map((e) => e.name)
                                            .concat(
                                              industries
                                                .filter((e) =>
                                                  item?.industry_category.includes(
                                                    e.id
                                                  )
                                                )
                                                .map((e) => e.name)
                                            )
                                            .join(", ")}
                                        </span>
                                      </div>
                                      <div className="col-12">
                                        <span className="fs-6 fw-bold">
                                          Description
                                        </span>
                                        <p>
                                          {limitText(
                                            removeHtmlTags(
                                              unescapeHtml(
                                                item?.content?.rendered ?? ""
                                              )
                                            ),
                                            50
                                          )}
                                          {removeHtmlTags(
                                            unescapeHtml(
                                              item?.content?.rendered ?? ""
                                            )
                                          ).length > 50 && "..."}
                                        </p>
                                      </div>
                                      <div className="col-12">
                                        <span className="fs-6 fw-bold">
                                          Brands
                                        </span>
                                        <p>{item?.exhibitor_name}</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-4 col-12">
                                    <ListGroup>
                                      <ListGroup.Item className="d-flex justify-content-left">
                                        <PushpinOutlined
                                          style={{
                                            marginTop: 4,
                                            marginRight: 6,
                                          }}
                                        />
                                        <span>Stand : {item?.stand}</span>
                                      </ListGroup.Item>
                                      <ListGroup.Item className="d-flex justify-content-left">
                                        <GlobalOutlined
                                          style={{
                                            marginTop: 4,
                                            marginRight: 6,
                                          }}
                                        />
                                        <a
                                          href={item?.company_url}
                                          className="text-decoration-none"
                                        >
                                          Company Website
                                        </a>
                                      </ListGroup.Item>
                                      <ListGroup.Item className="d-flex justify-content-left">
                                        <MailOutlined
                                          style={{
                                            marginTop: 4,
                                            marginRight: 6,
                                          }}
                                        />
                                        <a
                                          href={`mailto:${item?.company_email}`}
                                          className="text-decoration-none"
                                        >
                                          Company Email
                                        </a>
                                      </ListGroup.Item>
                                      <ListGroup.Item className="d-flex justify-content-left">
                                        <PhoneOutlined
                                          style={{
                                            marginTop: 4,
                                            marginRight: 6,
                                          }}
                                        />
                                        <a
                                          href={`tel:${item?.company_phone}`}
                                          className="text-decoration-none"
                                        >
                                          Company Phone
                                        </a>
                                      </ListGroup.Item>
                                    </ListGroup>
                                  </div>
                                  <div className="col-12 mt-2">
                                    <div className="row g-2">
                                      <div className="col-md-3 col-12 text-center">
                                        <Card>
                                          <Card.Img
                                            variant="top"
                                            src={item?.gallery_image_1}
                                          />
                                          <Card.Body>
                                            <Card.Title>
                                              {item?.gallery_title_1}
                                            </Card.Title>
                                          </Card.Body>
                                        </Card>
                                      </div>
                                      <div className="col-md-3 col-12 text-center">
                                        <Card>
                                          <Card.Img
                                            variant="top"
                                            src={item?.gallery_image_2}
                                          />
                                          <Card.Body>
                                            <Card.Title>
                                              {item?.gallery_title_2}
                                            </Card.Title>
                                          </Card.Body>
                                        </Card>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="row p-5" id="exhibitor-detail">
            <div className="col-12 mb-2">
              <span
                style={{
                  cursor: "pointer",
                }}
                className="text-secondary"
                onClick={backToExhibitor}
              >
                {" < "} Back to Exhibitor List
              </span>
            </div>
            <div className="col-12 col-md-9">
              <div className="card">
                <div className="card-body">
                  <div className="row mb-3">
                    <div className="col-12">
                      <span className="fs-6 fw-bold">Company Name</span>
                    </div>
                    <div className="col-12">
                      <p>{selectedPage?.exhibitor_name}</p>
                    </div>
                  </div>
                  <div className="row mb-1">
                    <div className="col-12">
                      <span className="fs-6 fw-bold">Description</span>
                    </div>
                    <div className="col-12">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: unescapeHtml(selectedPage?.content?.rendered),
                        }}
                      />
                    </div>
                  </div>
                  <hr />
                  <div className="row mb-1">
                    <div className="col-12">
                      <span className="fs-6 fw-bold">Country / Region</span>
                    </div>
                    <div className="col-12">
                      {countries
                        .filter((e) => selectedPage?.country.includes(e.id))
                        .map((e) => e.name)
                        .map((_name) => (
                          <Badge bg="secondary">{unescapeHtml(_name)}</Badge>
                        ))}
                    </div>
                  </div>
                  <hr />
                  <div className="row mb-1">
                    <div className="col-12">
                      <span className="fs-6 fw-bold">Industry Sector</span>
                    </div>
                    <div className="col-12">
                      {industries
                        .filter((e) =>
                          selectedPage?.industry_category.includes(e.id)
                        )
                        .map((e) => e.name)
                        .map((_name) => (
                          <Badge bg="secondary">{unescapeHtml(_name)}</Badge>
                        ))}
                    </div>
                  </div>
                  <hr />
                  <div className="row mb-1">
                    <div className="col-12">
                      <span className="fs-6 fw-bold">Country / Region</span>
                    </div>
                    <div className="col-12">
                      {countries
                        .filter((e) => selectedPage?.country.includes(e.id))
                        .map((e) => e.name)
                        .map((_name) => (
                          <Badge bg="secondary">{unescapeHtml(_name)}</Badge>
                        ))}
                    </div>
                  </div>
                  <hr />
                  <div className="row mb-1">
                    <div className="col-12">
                      <span className="fs-4 fw-bold">
                        Gallery of products and services
                      </span>
                    </div>
                    <div className="col-12">
                      <div className="row g-2">
                        <div className="col-md-3 col-12 text-center">
                          <Card>
                            <Card.Img
                              variant="top"
                              src={selectedPage?.gallery_image_1}
                            />
                            <Card.Body>
                              <Card.Title>
                                {selectedPage?.gallery_title_1}
                              </Card.Title>
                            </Card.Body>
                          </Card>
                        </div>
                        <div className="col-md-3 col-12 text-center">
                          <Card>
                            <Card.Img
                              variant="top"
                              src={selectedPage?.gallery_image_2}
                            />
                            <Card.Body>
                              <Card.Title>
                                {selectedPage?.gallery_title_2}
                              </Card.Title>
                            </Card.Body>
                          </Card>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="row">
                <div className="col-12">
                  <div className="card profile-nav">
                    <div
                      className="user-heading round"
                      style={{
                        backgroundImage: `url(${selectedPage?.banner_logo})`,
                      }}
                    >
                      <a href="#">
                        <img src={selectedPage?.logo} alt="" />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <div className="card bg-section text-black">
                    <div className="row m-3">
                      <div className="col">
                        <span
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={() => openLink(selectedPage?.fb_url)}
                        >
                          <FacebookFilled
                            style={{
                              fontSize: 30,
                              color: "#3b5998",
                            }}
                          />
                        </span>
                      </div>
                      <div className="col">
                        <span
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={() => openLink(selectedPage?.twitter_url)}
                        >
                          <TwitterSquareFilled
                            style={{
                              fontSize: 30,
                              color: "#00acee",
                            }}
                          />
                        </span>
                      </div>
                      <div className="col">
                        <span
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={() => openLink(selectedPage?.yt_url)}
                        >
                          <YoutubeFilled
                            style={{
                              fontSize: 30,
                              color: "#ff0000",
                            }}
                          />
                        </span>
                      </div>
                      <div className="col">
                        <span
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={() => openLink(selectedPage?.ig_url)}
                        >
                          <InstagramFilled
                            style={{
                              fontSize: 30,
                              color: "#c13584",
                            }}
                          />
                        </span>
                      </div>
                      <div className="col">
                        <span
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={() => openLink(selectedPage?.linkedln_url)}
                        >
                          <LinkedinFilled
                            style={{
                              fontSize: 30,
                              color: "#0e76a8",
                            }}
                          />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <div className="card bg-section text-black">
                    <div className="card-body d-flex justify-content-left">
                      <PushpinOutlined
                        style={{
                          marginTop: 4,
                          marginRight: 6,
                          fontWeight: "bold",
                        }}
                      />
                      <span>
                        <span className="fw-bold">Stand : </span>
                        {selectedPage?.stand}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="col-12 mt-2">
                  <div className="card bg-section text-black">
                    <div className="card-body">
                      <div className="row mb-2">
                        <div className="col-12">
                          <span className="fw-bold text-uppercase">
                            Company Website
                          </span>
                        </div>
                        <div className="col-12">
                          <a
                            href={selectedPage?.company_url}
                            className="text-decoration-none text-primary"
                          >
                            {selectedPage?.company_url === "#" ||
                            selectedPage?.company_url === null
                              ? "-"
                              : selectedPage?.company_url}
                          </a>
                        </div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-12">
                          <span className="fw-bold text-uppercase">
                            Company Email
                          </span>
                        </div>
                        <div className="col-12">
                          <a
                            href={`mailto:${selectedPage?.company_email}`}
                            className="text-decoration-none text-primary"
                          >
                            {selectedPage?.company_email === "#" ||
                            selectedPage?.company_email === null ||
                            selectedPage?.company_email === undefined
                              ? "-"
                              : selectedPage?.company_email}
                          </a>
                        </div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-12">
                          <span className="fw-bold text-uppercase">
                            Company Phone
                          </span>
                        </div>
                        <div className="col-12">
                          <a
                            href={`tel:${selectedPage?.company_phone}`}
                            className="text-decoration-none text-primary"
                          >
                            {selectedPage?.company_phone === "#" ||
                            selectedPage?.company_phone === null
                              ? ""
                              : selectedPage?.company_phone}
                          </a>
                        </div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-12">
                          <span className="fw-bold text-uppercase">
                            Address
                          </span>
                        </div>
                        <div className="col-12">
                          {selectedPage?.address ?? "-"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
