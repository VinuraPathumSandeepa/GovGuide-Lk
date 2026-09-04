function ComingSoon({
  title,
  description,
  icon,
}) {

  return (
    <main className="page-container">

      <div className="coming-soon">

        <div className="coming-soon-icon">
          {icon}
        </div>

        <h1>
          {title}
        </h1>

        <p>
          {description}
        </p>

        <span>
          This component will be implemented
          by the assigned team member.
        </span>

      </div>

    </main>
  );
}


export default ComingSoon;
