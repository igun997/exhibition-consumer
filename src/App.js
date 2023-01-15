import "./App.css";
import { getData } from "./service";
import { useEffect, useState } from "react";
import {
  Accordion,
  Badge,
  Card,
  Form,
  ListGroup,
  Pagination,
} from "react-bootstrap";
import {
  GlobalOutlined,
  MailOutlined,
  PhoneOutlined,
  PushpinOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { debounce } from "lodash";

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
      "id,title,content,exhibitor_name,logo,is_premium,banner_logo,description,country,industry_category,stand,fb_url,ig_url,twitter_url,yt_url,linkedln_url,company_url,company_phone,address,gallery_image_1,gallery_image_2,gallery_title_1,gallery_title_2",
    search: "",
    order: "asc",
    orderby: "is_premium",
    page: 1,
    per_page: 5,
  });
  const loadIndustryCategories = () => {
    getData("industry_category", {
      _fields: "id,name,slug,count",
    }).then((res) => {
      setIndustries(res.data ?? []);
    });
  };

  const loadCountries = () => {
    getData("country", {
      _fields: "id,name,slug,count",
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

  useEffect(() => {
    loadIndustryCategories();
    loadCountries();
  }, []);

  useEffect(() => {
    loadExhibitors();
  }, [filter]);

  return (
    <div className="row p-5" id="exhibitor-container">
      <div className="col-12 col-md-8 offset-md-2">
        {selectedPage === null ? (
          <div className="row">
            <div className="col-md-4 col-12">
              <div className="card empty-radius">
                <div className="card-header empty-radius">
                  <span className="fw-bold">Filter</span>
                </div>
                <div className="card-body empty-radius">
                  <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>Industry Sector</Accordion.Header>
                      <Accordion.Body>
                        {industries &&
                          industries.map((industry, key) => (
                            <div className="mb-3" key={key}>
                              <Form.Check type="checkbox">
                                <Form.Check.Input
                                  checked={filter.industry_category.includes(
                                    industry.id
                                  )}
                                  type="checkbox"
                                  onChange={(e) =>
                                    handleFilterIndustry(e, industry?.id)
                                  }
                                />
                                <Form.Check.Label>
                                  {industry?.name ?? "-"}{" "}
                                  <span className="text-muted">
                                    ({industry?.count ?? 0})
                                  </span>
                                </Form.Check.Label>
                              </Form.Check>
                            </div>
                          ))}
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1">
                      <Accordion.Header>Country / Region</Accordion.Header>
                      <Accordion.Body>
                        {countries &&
                          countries.map((country, key) => (
                            <div className="mb-3" key={key}>
                              <Form.Check type="checkbox">
                                <Form.Check.Input
                                  type="checkbox"
                                  checked={filter.country.includes(country.id)}
                                  onChange={(e) =>
                                    handleFilterCountry(e, country?.id)
                                  }
                                />
                                <Form.Check.Label>
                                  {country?.name ?? "-"}{" "}
                                  <span className="text-muted">
                                    ({country?.count ?? 0})
                                  </span>
                                </Form.Check.Label>
                              </Form.Check>
                            </div>
                          ))}
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </div>
              </div>
            </div>
            <div className="col-md-8 col-12">
              <div className="row m-md-0 m-2">
                <div className="col-12 mb-2">
                  <div className="input-group">
                    <div className="w-92">
                      <input
                        type="text"
                        onChange={debounce(handleSearchWithDebounce, 500)}
                        className="form-control"
                        id="inputGroupFile04"
                      />
                    </div>
                    <div className="input-group-append w-auto">
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
                <div className="col-md-6 col-12 mb-2">
                  {count > 0 && <span>Showing {count} results</span>}
                </div>
                <div className="col-md-6 col-12 mb-2">
                  {countPage > 1 && (
                    <Pagination>
                      <Pagination.First
                        disabled={filter.page === 1}
                        onClick={first}
                      />
                      <Pagination.Prev
                        disabled={filter.page === 1}
                        onClick={prev}
                      />
                      <GeneratePagination />
                      <Pagination.Next
                        disabled={filter.page == countPage}
                        onClick={next}
                      />
                      <Pagination.Last
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
                                Premium
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
                                    <div className="col-12">
                                      <span className="fs-3 text-black">
                                        {item?.exhibitor_name}
                                      </span>
                                    </div>
                                    <div className="col-12">
                                      <span className="fst-italic label-text m-2">
                                        Sponsor of{" "}
                                      </span>
                                      <Badge bg="secondary">
                                        {
                                          industries.find(
                                            (e) =>
                                              e.id == item?.industry_category[0]
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
                                      <div
                                        dangerouslySetInnerHTML={{
                                          __html: item?.content?.rendered ?? "",
                                        }}
                                      />
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
                                        href={item?.company_email ?? "#"}
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
                                    <div className="col-md-6 col-12 text-center">
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
                                    <div className="col-md-6 col-12 text-center">
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
        ) : (
          <>Detail Page</>
        )}
      </div>
    </div>
  );
}

export default App;
